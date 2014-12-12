var app = './public/';
var build = './build/';

//https://s3.amazonaws.com/snapjay.com/

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('aws.json'),
        //ec2: grunt.file.readJSON('aws.json'),



        svgstore: {
            options: {
                prefix: 'svg_', // This will prefix each ID
                svg: { // will be added as attributes to the resulting SVG
                    class: 'sprite'
                }
            },
            default: {
                files: {
                     './public/svg-defs.svg': [app + 'img/**/*.svg']
                }}
        },

        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    }, {
                        removeUselessStrokeAndFill: false
                    }
                ]
            },
            dist: {
                files: {
                    './public/svg-defs.min.svg': './public/svg-defs.svg'
                }
            }
        },

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWS_ACCESS_KEY_ID %>', // Use the variables
                secretAccessKey: '<%= aws.AWS_SECRET_ACCESS_KEY %>', // You can also use env variables
                region: '<%= aws.AWS_S3_REGION %>',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                differential: true, // Only uploads the files that have changed
                displayChangesOnly: true, // Only uploads the files that have changed
                access:'public-read',
                gzip: true,
                excludedFromGzip: ['*.png', '*.jpg', '*.ico', '*.mp4', '*.webm' ]
            },
            production: {
                options: {
                    bucket: '<%= aws.AWS_S3_BUCKET %>',
                    params: {
                        CacheControl: 'max-age=630720000, public' // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
//                        Expires: 'Thu, 29 Nov 2019 00:29:29 GMT'
//                        ContentEncoding: 'gzip' // applies to all the files!
                    },
                    mime: {
//                        'dist/assets/production/LICENCE': 'text/plain'
                    }
                },
                files: [
                    {expand: true, cwd: build, src: ['**'], dest: ''}
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

        cloudfront: {
            options: {
                accessKeyId: "<%= aws.AWS_ACCESS_KEY_ID %>",
                secretAccessKey: "<%= aws.AWS_SECRET_ACCESS_KEY %>",
                distributionId: 'E137XGN40OE09G',
                invalidations: [
                    '/index.html'
                ]
            }
        }

    });


    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-ec2');
    grunt.loadNpmTasks('grunt-svgmin');

    //grunt.loadNpmTasks('load-grunt-tasks');

    grunt.registerTask('default', ['svgstore', 'svgmin']);
    grunt.registerTask('Upload', ['aws_s3:production', 'cloudfront']);
    grunt.registerTask('Generate SVG', ['svgstore', 'svgmin']);



};