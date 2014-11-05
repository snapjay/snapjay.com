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
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            production: {
                options: {
                    bucket: '<%= aws.bucket %>',
                    params: {
//                        ContentEncoding: 'gzip' // applies to all the files!
                    },
                    mime: {
//                        'dist/assets/production/LICENCE': 'text/plain'
                    }
                },
                files: [
                    {expand: true, cwd: 'build/', src: ['**'], dest: ''}
                    // CacheControl only applied to the assets folder
                    // LICENCE inside that folder will have ContentType equal to 'text/plain'
                ]
            },

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