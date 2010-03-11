PunyMCE - The Puny JavaScript Rich Text editor
===============================================

What you need to build PunyMCE
-------------------------------
* Install the Java JDK or JRE packages you can find it at: [http://java.sun.com/javase/downloads/index.jsp](http://java.sun.com/javase/downloads/index.jsp)
* Install Apache Ant you can find it at: [http://ant.apache.org/](http://ant.apache.org/)
* Add Apache Ant to your systems path environment variable, this is not required but makes it easier to issue commands to Ant without having to type the full path for it.

How to build PunyMCE
---------------------

In the root directory of PunyMCE where the build.xml file is you can run ant against different targets.

`ant`

Will combine, preprocess and minify the PunyMCE puny_mce_src.js into puny_mce.js and all plugins etc into puny_mce_full.js.

`ant moxiedoc`

Will generate API Documentation for the project using the Moxiedoc tool. The docs will be generated to the docs/api directory.

`ant release`

Will produce an release package of the current repository code. The release packages will be placed in the tmp directory.
