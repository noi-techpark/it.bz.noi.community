pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                sh """
                    cd src/come-on-board
                    test -f en.html
                    test -f de.html
                    test -f it.html
                """
            }
        }
    }
}
