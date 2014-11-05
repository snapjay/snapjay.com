module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('aws.json'), // Read the file
        svgstore: {
            options: {
                prefix: 'svg_', // This will prefix each ID
                svg: { // will be added as attributes to the resulting SVG
                    class: 'sprite'
                }
            },
            default: {
                files: {
                    './app/svg-defs.svg': ['./app/img/**/*.svg']
                }}
        },

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>', // Use the variables
                secretAccessKey: '<%= aws.secret %>', // You can also use env variables
                region: 'us-east-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                differential: true, // Only uploads the files that have changed
                displayChangesOnly: true, // Only uploads the files that have changed
                access:'public-read'
            },
            production: {
                options: {
                    bucket: '<%= aws.bucket %>',
                    params: {
                        CacheControl: 'max-age=630720000, public' // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
//                        ContentEncoding: 'gzip' // applies to all the files!
                    },
                    mime: {
//                        'dist/assets/production/LICENCE': 'text/plain'
                    }
                },
                files: [
                    {expand: true, cwd: 'build/', src: ['**'], dest: ''},
                    //{
                    //    cwd: "./build",  //Start in this folder
                    //    dest: "/",
                    //    action: 'delete'
                    //},
                    //{
                    //    expand: true,
                    //    cwd: "./build",  // Start in this folder
                    //    src: ["**/*.*"],                         // Read these files inside cwd
                    //    dest: ""
                    //}
                ]
            }

        },


        ngtemplates: {
            templates: {
                cwd: './app/',
                src: 'partials/**.html',
                dest: './app/js/templates.js',
                options: {
                    standalone:true,
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
                }
            }
        }
    });



    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', ['svgstore']);



};