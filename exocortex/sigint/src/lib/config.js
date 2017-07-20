/*
this is an API for storing and updating a config on sigint-config service

* config discovery
    * request config object on start
    * listen for config service start, and then request config

* config validation
    * listen for new config object
    * validate config object
    * respond with validated config object (and maybe a schema for it?)

* config diff
    * diff updated config with prior version
    * perform operations as needed (join / leave channels etc..)

*/
