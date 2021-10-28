pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                sh """
                    cd src/onboarding
                    test -f en.html
                    test -f de.html
                    test -f it.html
                """
            }
        }
    }
}
