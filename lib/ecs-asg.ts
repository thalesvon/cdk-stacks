import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2';
import * as autoscaling from '@aws-cdk/aws-autoscaling';

// 
/*
    ami-060fdc00b63abc251 => aws ssm get-parameters --names /aws/service/ecs/optimized-ami/amazon-linux-2/recommended --region eu-west-1
    EBS Mappings => /dev/xvda=snap-04545626bbddaa859:30:true:gp2
*/

export class EcsAsgStack extends cdk.Stack {
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

      cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
        instanceType: ec2.InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.LARGE),
        machineImage: ecs.EcsOptimizedImage.amazonLinux(),
        desiredCapacity: 2,
        blockDevices:[{
            deviceName: '/dev/xvda',
            volume: ec2.BlockDeviceVolume.ebs(100),
        }]
      });

      const loadBalancedEcsService = new ecs_patterns.ApplicationLoadBalancedEc2Service(this, 'Service', {
        cluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
        },
        desiredCount: 2,
      });
    }
  }
