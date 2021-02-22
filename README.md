#  Easy Conference System
This was created as apart of our final project before graduation. The project owner, Easy-Conferece wanted to make conference scheduling easier during the time of Covid-19 as their current process was manually data entry within an spreadsheet. We proposed an online system that would handle nominations for topics for different conferences and allow staff to easily see instant viewing of data within areas of the system. 

[Access Easy Conference System](https://easyconferencescheduling.web.app)

[Access the portfolio piece about the project](https://portfolium.com/pp/3FBBB6DF-4F50-4953-B888-FA0BA7A7A06D)

## Technologies
The project utilised a variety of technologies and frameworks for all parts of the project. Our front end, website, was built using pure vanilla HTML, CSS, Javascript. User authentication was handled by using the Firebase API on our website.

The back end was written in Typescript and was built as an REST API that ran on NodeJS inside cloud functions hosted in Firebase. By doing so, we created a server less backend that would only run as needed via calls to our endpoints which would save on running costs. For our Database layer, we used MySQL running on Google Cloud SQL which was interacted with via TypeORM, our ORM library of choice, to make interactions easier and enabled an easier modelling of objects.

 

 - Back end
	 - MySQL running inside Google Cloud SQL
	 - TypeORM - object-relational mapping library
	 -  Express - middleware library
	 - TypeScript and NodeJS
	 - Firebase Admin SDK
 - Front end
	 - HTML
	 - CSS
	 - Javascript
	 - Bootstrap
