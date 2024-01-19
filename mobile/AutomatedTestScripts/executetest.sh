  #!/bin/bash
  cd {{TEST-FOLDER}};
  export JAVA_HOME=/opt/app/jvm/jdk1.8.0_45/;
  export M3_HOME=/opt/app/maven/apache-maven-3.3.3/bin;
  export PATH=$PATH:$JAVA_HOME:$M3_HOME;
  echo "Running UI Test";
  mvn test -f UI -DRunIntegrationTest=true -Djavax.net.ssl.trustStore=/opt/citools/Jenkins_Prod/0bf59623/etc/cacerts.keystore;
  exit 0