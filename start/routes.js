'use strict'

const { RouteResource } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//Route.on('/').render('welcome')

Route.get('/', ({ response, request }) => {

    response.status(200).send("Message");
})


Route.group(() => {


    Route.get('tasks', 'TaskController.index')
    Route.get('task/:id', 'TaskController.show')
    Route.post('task', 'TaskController.store')
    Route.put('task/:id', 'TaskController.update')
    Route.delete('task/:id', 'TaskController.delete')
    Route.post('signup', 'UserController.create')
    Route.post('login', 'UserController.login')
    Route.get('/logout', 'UserController.logout')
    Route.get('/show', 'UserController.show').middleware('EnsureAuthenticated')


}).prefix('api')


