how to run the mars_rover(Front-end) 

  1. Creating the front end container (windows)
        docker build -t mars_rover_front .  -- to create the image
        docker run -d -p 8080:80 --name mars_rover_front_container mars_rover_front -- to create and run the container with the name mars_rover_front_container it runs on 8080 because of nginx.
        docker ps -- to check out if the application is running
