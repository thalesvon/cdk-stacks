import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as autoscaling from "@aws-cdk/aws-autoscaling";



export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    var ww = new String('Simulation');
    const vpc = new ec2.Vpc(this, ww.concat("Vpc"), {
      cidr: "10.0.0.0/16",
      maxAzs: 2
    });

    const cluster = new ecs.Cluster(this, ww.concat("Cluster"), {
      vpc: vpc
    });

    const logging = new ecs.AwsLogDriver({streamPrefix:'ww3d-server'});

    const ww3dserver = new ecs.FargateTaskDefinition(this, 'Service-ww3d-server',{
      cpu: 1024,
      family: 'ww3d-server',
      memoryLimitMiB: 2048
    });

    const container = ww3dserver.addContainer('ww3d-server-container', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      cpu: 1024,
      memoryLimitMiB: 2048,
      memoryReservationMiB: 2048,
      essential: true,
      dockerLabels: { SERVICE_NAME: 'puma'},
      logging: logging
    });

    container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP
    });

    const fargateSerive = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "ww3d-server", {
      cluster: cluster,
      cpu: 1024,
      desiredCount: 6,
      taskDefinition: ww3dserver,
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    });
    
    const scalableTarget = fargateSerive.service.autoScaleTaskCount({
      minCapacity: 5,
      maxCapacity: 20,
    });

    scalableTarget.scaleOnMetric('CpuUtization', {
      metric: fargateSerive.service.metricCpuUtilization(),
      scalingSteps:[
        { upper: 10, change: 5 },
        { lower: 60, change: 10},
        { lower: 80, change: 20 }
      ],
      adjustmentType: autoscaling.AdjustmentType.EXACT_CAPACITY,
      cooldown: cdk.Duration.seconds(60),
    });

    /*scalableTarget.scaleOnMetric('NewConnectionCount',{
      metric: fargateSerive.loadBalancer.metricRequestCount({statistic: 'Maximum'}),
      scalingSteps:[
        { upper: 0.7, change: -5 },
        { lower: 1, change: +100 }
      ],
      adjustmentType: autoscaling.AdjustmentType.PERCENT_CHANGE_IN_CAPACITY,
      cooldown: cdk.Duration.seconds(60),
    });*/
  }
}
