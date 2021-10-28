pipeline {
    agent any
    options {
        ansiColor('xterm')
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws_secret_key_id')
        AWS_SECRET_ACCESS_KEY = credentials('aws_secret_access_key')
    }
    stages {
        stage('Upload') {
            steps {
                s3Upload(bucket: 'it.bz.noi.community-test', acl: 'PublicRead', file: './src/onboarding')
            }
        }
    }
}
