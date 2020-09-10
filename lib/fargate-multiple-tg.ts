import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';


export class FargateMultiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Creating VPC
    const vpc = new ec2.Vpc(this, "Vpc", {
      cidr: "172.16.0.0/16",
      maxAzs: 2
    });
    // Creating Cluster
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc
    });

    // Creating First Load Balanced Service. This Will Create the Service+LoadBalancer
    // Service here is using taskImageOptions, allows quicker setup but fewer options.
    const loadBalancedFargateService = new ecs_patterns.ApplicationMultipleTargetGroupsFargateService(this, 'Service1', {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      loadBalancers: [
        {
          name: 'lb1',
          listeners: [
            {
              name: 'listener1'
            }
          ]
        }
      ],
      targetGroups: [
        {
          listener: 'listener1',
          containerPort: 80,
          pathPattern:'/service1/*',
          priority: 1
        }
      ]
    });

    // Creating Listener default action
    loadBalancedFargateService.listener.addAction('default',{
      action : elbv2.ListenerAction.fixedResponse(200, { messageBody: 'This is the ALB Default Action' })
    });


    const taskDefinition = new ecs.FargateTaskDefinition(this, "Service2TaskDef",{
      memoryLimitMiB: 1024,
      cpu: 512
    });

    const container = taskDefinition.addContainer("Service2Container", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 1024,
        cpu: 512,
    });
    container.addPortMappings({containerPort: 80})

    const fargateService2 = new ecs.FargateService(this, "Service2", {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 1,
    });

    // Set up security group ingress/egress between LB and new service
    fargateService2.connections.allowFrom(loadBalancedFargateService.loadBalancer, ec2.Port.tcp(80));
    loadBalancedFargateService.loadBalancer.connections.allowTo(fargateService2, ec2.Port.tcp(80));

    
    const tg = new elbv2.ApplicationTargetGroup(this, "service2targetgroup", {
        targets: [fargateService2],
        protocol: elbv2.ApplicationProtocol.HTTP,
        vpc,
    });

    // attaching Target Group to existing ALB
    loadBalancedFargateService.listener.addTargetGroups("targetgroup", {
        targetGroups: [tg],
        pathPattern: "/service2/*",
        priority: 2
    });
  }
}