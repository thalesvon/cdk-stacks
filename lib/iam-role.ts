import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class IamStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    
        var role = new iam.Role(this, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('sns.amazonaws.com'),
          });

        role.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'] }));
    }
}
