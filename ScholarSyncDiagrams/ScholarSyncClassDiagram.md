## Class Diagram

![Class Diagram](ScholarSyncERDiagram.png)

*This Class Diagram shows how the Scholar Sync User who manages events, tasks and study settings. The user is the main class where the user information is stored for all taks and events. The event class contains the event information and setters. UserEvent is the custom event created by the user which inherits the Event class allowing for adding and deleting events. CanvasEvent is the school events that is inherented from Event and adds the deadline and description of the assignment. Pom_setting sets the pomodoro timer for the time to work on assignments and updates those tasks. Ics Parser reads the calender file and creates a list of all the Events. Auth handles the user sign up and registering. 
