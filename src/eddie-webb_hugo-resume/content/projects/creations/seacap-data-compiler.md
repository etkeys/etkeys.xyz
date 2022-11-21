---
title: SeaCAP Data Compiler
date: 2016-07-01T00:00:00-05:00
description: >
    A tool that combined multiple smaller applications that into a single workflow
    to fetch, transform, and pass-on engineering bill of materials to be used as
    an estimate for contract proposals.
image: ''
tags: [multi-threaded, multi-user, atomic-operations, net-framework, data-transformation, odbc]
featured: true
weight: 100
sitemap:
    priority: 0.8
---

### Contents
1. [Abstract](#abstract)
1. [Details](#details)
1. [Reflections](#reflections)

### Abstract

To better facilitate contract negotiations, the company I worked for at the time
required the engineering groups to aggregate a large amount of data that
represented the various items that needed to be purchased and/or produced to
create a final product. That data needed to be transformed to include previous
purchase history, dates for when the items were actually needed and when they
needed to be ordered (adjusted for lead time), as well as summary weight
information (when needed). All of the data needed to be cleaned and standardized
prior to staging for upload into another system used by the contracts group. An
attempt was made to automate some of the processes involved with this effort but
the methods used were not maintainable.  The resulting automation was plagued
with various problems from low concurrency, high failure rate, low fault
tolerance, obsolete third party libraries, and incorrect tool application.  I
came to the project at the tail end of the first iteration of the automation and
soon I found myself as the project lead with a better vision for how the project
should achieve its goals.

### Details

A system was needed that merged design, planning, and previous purchase information, 
as well as perform situational product quantity and weight calculations. The various 
data sets had to be collated in a way that each element was logical related some 
product. The number of products that needed to be produced were in the tens of 
thousands and and in total, the number of distinct elements for all the products 
approached near tens of millions of items. 

The original tool choice used for this effort was Microsoft Excel Visual Basic for 
Applications (VBA). While VBA is great for small scale data manipulation and 
transformation, it does not scale well. The amount of through put that was needed 
for this system was too much for VBA to accommodate. The system also used API for 
data warehouse reporting that was no longer supported and incompatible with the 
company wide operating system upgrade. The system was also limited in that it could 
only have a handful of users working with the available front end clients at a time. 
Due to the shear amount of data that had to be generated, management wanted more 
bodies committed to processing for a shorter amount of time than have a single 
appointed person for a much longer duration. 

I was brought onto the project at the very end of the initial system’s life. The 
previous development team was leaving the company and a replacement team was needed. 
Until the production effort was completed, I acted as an observer, mostly. I listed 
to user feedback and asked questions about how the system operated, what specific 
functions did it perform. I even assisted in debugging crashes on occasion. A few 
weeks after I joined the project, processing had been completed and it wasn't long 
before a lessons learned sharing event occurred. Management, the design/engineering 
community, and I all recounted the good and the bad of the automation and soon a 
list of requirements for a new system was developed.  I would be the lead developer 
of the project, a "shadow developer". This team composition decision was made due to 
time and budget constraints and my domain knowledge would shortcut some of the 
domain knowledge sharing. The initial system was developed by a couple engineers, 
and I felt confident in my ability, even though I had only been programming for a 
few months. The general requirements for the new system were this:

- The new system must implement all business rules defined by the initial system.
- The new system must allow for more concurrent users.
- The new system must handle more of the data marshaling between the various processing stages, reducing the opportunities of user involvement.
- The new system must implement a new sustainable interface to upstream data sources.
- The new system must tightly control and provide validation for more of the user supplied support data, keeping references consistent and notation uniform.
- The new system should be more fault tolerant and if an issue do occur, feedback should be more clear to users.
- Documentation about how to use the new system must be provided.

The initial budget to design, develop, test, and distribute the new system, code 
named “SeaCAP Data Compiler (SDC)”, was 800 man hours. My initial approach was to 
convert all the Microsoft Excel macros and rule tables to Microsoft Access VBA code 
and Access tables and stored queries. I developed a GUI using Access form objects 
that provided a more intuitive interface for users. Sadly, I must admit, that due to 
my inexperience, I underestimated the scalability of Access, something that wasn’t 
apparent until testing. The SDC worked fantastically at a small scale, but suffered 
performance issues as it was scaled up. So much so that it became unstable and prone 
to fatal crashes. To add to that, the newly developed data retrieval method was very 
similar to the old method in that it was too dependent on API where long term 
support couldn’t be guaranteed and a configuration scheme that had a high resistance 
to change. At the end of it all, the SDC was released in a small scale production 
run for two weeks, enough time to produce a handful of deliverables. Fortunately, 
this was all that was needed at the time. The SDC was shelved after its short run 
and the project ended at 200 hours over budget, but a good deal of feedback from the 
customer and users about how the system could be improved. This would not be the end 
of the SDC.

Two years later, I was approached by the customer and asked to resurrect the SDC. I 
considered the previous iteration of the SDC a failure for multiple reasons, most of 
which pointed back to the use of VBA and a poor interface to data sources. I was 
approved to apply changes based on feedback, observations and lessons learned from 
the use of the previous iteration. My project budget for this effort was 750 hours. 
Having had a couple more years of development and exposure to new tools, I proposed 
that the system move away from VBA as the core processing platform in favor of 
Microsoft’s .NET Framework. The following lists how I overcame issues with the 
initial system and previous iteration of the SDC:

1. The new SDC was made available to multiple users at a single time.
    - Front end clients were made more generic. Different engineering groups did
    not need a separate client for their group.
    - The business logic was extracted and placed into compiled elements which
    could be shared more easily.
    - Modified business logic to make the system aware that it will be used in a
    multi-user environment by acting on specified data sets at run-time rather
    than acting on anything that exists.

1. With the new arrangement of business logic, all the various code source branches 
were consolidated into a new master. The system was made intelligent enough to 
distinguish between different engineering groups and apply the required business 
rules at runtime.

1. Even more per user throughput was achieved by leveraging .NET’s multi-threading 
components. In fact, there was a risk that multiple users spooling multiple 
threads each would affect the stability the network servers so a means of 
throttling maximum threads per users was implemented to reduce the threat to the 
network.

1. Converting to the .NET Framework alone achieved a reduction in processing time. 
The processing time per deliverable was reduced to an average observed start to 
finish time of approximately three minutes, down from an average of 30 minutes 
(anecdotal). Most of this time was spent waiting of data retrieval from a 
upstream data sources.

1. Processing of a deliverable was made atomic and more fault tolerant. Most errors 
occurred on worker threads which allowed the main thread to be dissociated from 
errors that would have otherwise been fatal. If an error occurred, any changes 
to the initial data were discarded leaving the initial data in unmodified state. 
The worker thread would be terminated and restarted by the main thread with a 
new target deliverable to process. The deliverable that was being processed when 
an error occurred would be logged and recorded for investigation.

1. Feedback to users was made more clear as the exception detail provided by the 
.NET Framework could provide more details to summarize the cause of issues. For 
common user cause errors, correction instructions were provided in addition to 
exception details.

1. A long term data retrieval method was developed that abandoned the idea of 
relying on specialized data  warehouse reporting APIs, and instead used direct 
data warehouse queries using ODBC. This method was approved for use by the 
responsible data warehouse IT management group.

1. .NET memory management was much more advanced which kept the compiled executable 
more stable and reliable. The ability to leverage 64bit operations also added 
more to the stability of the executable as it could accommodate larger data 
sets.

1. User supplied reference data was made more consistent and uniform as users had 
to supply  the reference data through an interface that applied validation logic 
rather than the users having direct access to the data store.

1. The new SDC also greatly reduced the opportunities that a user could affect the 
data between start and finish because the user never had direct access to the 
data store. All access to data in the data store was done through an interface, 
obscuring the true data store location the means by which the SDC managed to 
location of objects within the data store. Admin users of the SDC did have 
direct access to the data store and the means to update the managed locations if 
the need arose.

This second and final version of the SDC was delivered on time and 50 hours under budget. The first production run of the application lasted for two months and was a 
huge cost savings over the previous systems. To date, this application has been in 
use for two year has saved the customer and The Company millions by reducing the man 
hours needed to manage processing of the application and rework hours due to 
inconsistent reference data.

### Reflections

Reflecting back on this project, it was the project that caused me to grow the most. 
I was on my own. Technically a junior developer who didn’t know much about the 
system he was working in. I had to research knew concepts and correct bad practices 
that I had formed. I met many hurdles: design problems, ambiguous and evolving 
requirements, lack of knowledge from domain experts, constrained budget, and limited 
resources, but I overcame them all. When asked, I always say I hate the SDC, but in 
truth I don’t.