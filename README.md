# cox-solution-finder

This project has two modes: showroom and website. The default view is the
website, all templates for this view reside in `templates/views`. This is
the default folder for keystone.

The showroom view is enabled by setting an environment variable. To use this
for development/deployment create a .env file in the project root with the
following line:

      SOLUTION_MODE=showroom

This will be picked up by keystone.js and change the views directory to be
`templates/views/showroom`.

The `.env` is ingorned by git, *do not add it to the repo*.

