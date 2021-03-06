# cloudformation-yml-merger-cli
The CLI tool to merge the multiple template files for the AWS Cloudformation into one template file. 

- Automatically merge all the Cloudformation template yml files into one big yml file.
- The AWSTemplateFormatVersion will be located at the beginning of the generated yml file. 
- For SAM([Serverless Application Model](https://github.com/awslabs/serverless-application-model)), the Transform will follow the AWSTemplateFormatVersion if the Transform exist. 
- The blank lines will be trimed automatically.
- All yml comments will be removed

## Why implemented? 

The [SAM CLI](https://github.com/awslabs/aws-sam-cli) is a great tool to provide a convenient way to make a package and deploy to the AWS account easily.  However, since it supports only one cloudformation template file, we need a tool to combine multiple yml files before packaging. 

Let's assume a project folder structure as below.

```
Project Root
|- cloudformation - master.yml
|              |- resources - resource1.yml, resource2.yml
|              |- parameters - parameters.yml
|- lambda - src -  api - api.js
|      |      |- utils - utils.js
|      |__ tst - api - api-test.js
|             |- utils - utils.js
|- package.json
```

We could deploy the cloudformation and lambda functions all together to the AWS account with the cloudformation-yml-merger.

```
$ cd project-root
$ cloudformation-yml-merger-cli -i cloudformation -o merged-cfn.yml
$ sam package --template-file merged-cfn.yml --output-template-file serverless-output.yaml --s3-bucket s3-bucket-in-your-account
$ sam deploy --template-file serverless-output.yaml --stack-name a-great-stack-name --capabilities CAPABILITY_IAM
```

## How the yml files to be merged.

Let's assume a folder A contains multiple yaml files as below:

```
A  
|- a.yaml
|- B - b.yaml
|- C - c.yml
```

```
# a.yaml
AWSTemplateFormatVersion: 
  '2010-09-09'
Transform: AWS::Serverless-2016-10-31
```

```
# b.yaml
Description:
  "description"
  
Outputs:
  Test:
    value: "sample value"

Resources:  
  SampleBucket: #S3 
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: PublicRead
```

```
# c.yml
Resources:
  APIGLambdaFunction: #Lambda 
    Type: AWS::Serverless::Function
    Properties:
      Handler: sample/sample.handler
```

The merge results would be as follows. All the comments and blank lines will be deleted and all the resources will be located in one Resources property. 

```
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Resources:
  SampleBucket: 
    Type: 'AWS::S3::Bucket'
    Properties:
      AccessControl: PublicRead  
  APIGLambdaFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: sample/sample.handler
Description: description
Outputs:
  Test:
    value: sample value
```

## How to install 

```
$ npm install -g cloudformation-yml-merger-cli
```

## How to use in CLI

Merge multiple yml template files into one big yml file to deploy to your AWS account.

```bash
$ cloudformation-yml-merger-cli -i path-to-folder -o target-yml-file
```

The example with the project folder structure above is.

```
$ cloudformation-yml-merger-cli -i cloudformation -o merged.yml
```

- path-to-folder : the path to the folder contains multiple yml files and sub folders to be merged. An error happens if it's not provided, it doesn't exist, it's not a direct child directory, it doesn't contain any yml file, or any yml file doesn't contain the AWSTemplateFormatVersion.
- path-to-target-yml-file: the path of the target file to be generated. An error happens if it's not provided. 
