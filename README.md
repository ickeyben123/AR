# Find AR

This app allows a user to store tags associated with their items and then 
be able to see them in Augmented Reality on their phone. The target audience
that this project is aimed for are older people and therefore the app is made 
to be simple and intuitive to use. A user can place an item in a room and then 
place a tag on it and store its location so that they can use augmented 
reality to see the general position of the item to remind themselves of where 
the item is. 

The user can create and store information for each tag such as it's name and 
logo. If a user moves an item they can pick their tag up and place it in 
another place which would change the tag's geo-location. 


## How to build this project

In order to build this project the user needs to install the IBMCloud CLI, and Docker. 

Dependencies:
- Docker: https://docs.docker.com/get-started/overview/
- IBMCloud CLI Version v2.15.0: https://github.com/IBM-Cloud/ibm-cloud-cli-release/releases/

Do note that the IBMCloud CLI is used to setup and run the server in an easy 
single command. Fundamentally it is just a docker container defined by a dockerfile, 
and thus can be set up if you have sufficient docker knowledge.

Do NOT use the latest IBMCloud cli version, as the specific commands used are deprecated.

### Command to build the project:

    sudo ibmcloud dev build [--debug]

### Command to run the project:

    sudo ibmcloud dev run

### Command to test the project:

    sudo ibmcloud dev test

It is sufficient to first build, and then run the project. You do not need to build more 
than once, and once running you can use tools such as Dev Containers to enter the 
container and perform edits. 
