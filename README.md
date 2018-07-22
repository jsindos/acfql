# acfql

This project aims to automatically generate a graphql schema from a WordPress installation using advanced custom fields and custom post types. Suggested knowledge to get the project up and running is a basic knowledge of npm and the terminal.

## Getting Started

### Set up an advanced custom fields WordPress installation

Due to the popularity of WordPress, there are many ways to set up a WordPress installation. The most basic way is to download it from the [official site](https://wordpress.org/download/). Host the WordPress using your choice of local hosting, and [install the advanced custom fields plugin](https://wordpress.org/plugins/advanced-custom-fields/). If you wish, you may [set up a custom post type](https://codex.wordpress.org/Post_Types#Custom_Post_Types), and then attach advanced custom fields to the custom post type using the ACF interface.

### Export the advanced custom fields and custom post types using advanced-custom-fields-wpcli

Follow the steps outlined in https://github.com/hoppinger/advanced-custom-fields-wpcli to install the ACF WordPress export tool. This will allow you to export your advanced custom fields to a JSON representation.

After installation, run the following command in the root of your WordPress directory

```
wp acf export --export_path=/path/to/acfql/repository/acf-exports/
```

This will create a directory named `acf-exports` inside of the acfql repository containing the JSON representation of the advanced custom fields.

### Build the schema

To build the schema, run `npm run build-schema`. The schema is built using the template files inside of `src/` and the JSON files in `acf-exports/`. The generated files appear in `graphql/`.

### Create database settings file

In order for graphql to serve the advanced custom fields and custom post types, it must connect to your WordPress database. Copy the example settings file using the following command

```
cp settings.example.js settings.js
```

Fill out the relevant database details in `settings.js`.

### Host the graphql endpoint

Running the following command will host the graphql endpoints using nodemon

```
npm run server
```

This will host a graphql endpoint on http://localhost:3001/graphql and a graphiql endpoint on http://localhost:3001/graphiql.

In case you haven't graphiql before or need a refresher, there are many great resources on YouTube and around the web to understand how to make graphql queries.

## Testing

Tests are run using

```
npm run test
npm run test-watch
```

The tests mostly deal with the ACFStore. I plan to extend the tests to the generated code once I can figure out how to use `sequelize-mock` correctly ;)

## Thanks

Big thanks to https://github.com/ramsaylanier/WordExpress on which this project is based and inspired from. Thanks to https://github.com/hoppinger/advanced-custom-fields-wpcli which made exporting of the advanced custom fields possible in an easy manner.