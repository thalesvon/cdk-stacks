import * as cdk from '@aws-cdk/core';
import { FargateStack } from '../lib/fargate-project-stack';
import { FargateMultiStack } from '../lib/fargate-multiple-tg';
import { EcsAsgStack } from '../lib/ecs-asg';
import { IamStack } from '../lib/iam-role';
import { MacroStack } from '../lib/macro';
import { MacroUsageStack } from '../lib/usage'


const app = new cdk.App();
new FargateStack(app, 'FargateStack',{ env:
  {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
  }
});

new FargateMultiStack(app, 'FargateMultiStack',{ env:
    {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
    }
  });

new EcsAsgStack(app, 'EcsAsgStack',{ env:
    {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
    }
});

new IamStack(app, 'IamStack',{ env:
  {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
  }
});

new MacroStack(app, 'MacroStack',{ env:
  {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
  }
});

new MacroUsageStack(app, 'MacroUsageStack',{ env:
  {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
  }
});