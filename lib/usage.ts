import * as cdk from '@aws-cdk/core';


export class MacroUsageStack extends cdk.Stack{
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        
        this.templateOptions.transforms = ['CountMacro'];

        new cdk.CfnInclude(this, 'Snippet', {
            template: {
              Resources: {
                taskdefinition:{
                    Type: 'AWS::ECS::TaskDefinition',
                    Count: 3,
                    Properties: {
                      ContainerDefinitions:[{
                        Name: 'busybox',
                        Image: 'busybox',
                        Cpu: 256,
                        Entrypoint: ['sh','-c'],
                        Memory: 512,
                        Command:['/bin/sh -c \"while true; do /bin/date ; sleep 1; done\"'],
                        Essential: true
                      }] 
                    }
                }
              }
            },
        });
    }
}