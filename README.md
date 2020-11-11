# Welcome to your CDK TypeScript project!

This is a repository for many CDK stack defined separatly

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `npm run deploy [STACK-NAME]`  install + build + deploy (recommended)
 * `npm run deploy:ci [STACK-NAME]`  install + build + deploy + doesn't require manual approval


## Available Stacks


**FargateStack**, additional information:

 - Fargate service with autoscaling configured.


**FargateMultiStack**, additional information:

 - Use 'ecs_patterns.ApplicationMultipleTargetGroupsFargateService' to create many Fargate Services behind the same Load Balancer.

**EcsAsgStack**, additional information:

 - Create Esc Cluster using Ec2. On the Ec2 the block device mapping is change from the AMI.

**IamStack**, additional information:

 - IAM role management with CDK

**MacroStack and MacroUsageStack**, additional information:
 
 - Creates a CFN Macro and use it. 
 - Deploy `MacroStack` first and then `MacroUsageStack`.

## Scrap Section

just a place to put temporary text...
