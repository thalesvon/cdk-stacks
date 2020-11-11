import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');

export class MacroStack extends cdk.Stack{
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const lambdaFn = new lambda.Function(this, 'Singleton', {
            code: lambda.Code.fromAsset("./function/", {exclude: ["**", "!index.py"]}),
            handler: 'index.handler',
            timeout: cdk.Duration.seconds(120),
            runtime: lambda.Runtime.PYTHON_3_6,
          });
        const macro = new cdk.CfnMacro(this,'MyMacro',{
            description: 'Multiplies the instances of a CloudFormation resources in a stack',
            name: 'CountMacro',
            functionName: lambdaFn.functionName
        });
    }
}