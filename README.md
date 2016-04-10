# Guía de estilo AngularJS para uso interno de PSI

*Basada en la guía de estilos colaborativa de Angular para equipos por [john_papa](//github.com/johnpapa)*

El propósito de esta guía de estilos es proporcionar una guía de cómo construir aplicaciones con Angular enseñando convenciones de uso y, lo más importante, el porqué.

## Mira los estilos en la aplicación de ejemplo
Esta guía viene acompañada de un proyecto de ejemplo que sigue los estilos y patrones.

## Tabla de contenidos

  1. [Responsabilidad Única](#single-responsibility-o-responsabilidad-Única)
  1. [IIFE](#iife)
  1. [Módulos](#módulos)
  1. [Controladores](#controladores)
  1. [Servicios](#servicios)
  1. [Factory](#factory)
  1. [Servicios de Datos](#servicios-de-datos)
  1. [Directivas](#directivas)
  1. [Resolviendo Promesas en un Controlador](#resolviendo-promesas-en-un-controlador)
  1. [Anotación Manual para la Inyección de Dependencias](#anotación-manual-para-la-inyección-de-dependencias)
  1. [Minificación y Anotación](#minificación-y-anotación)
  1. [Cómo Nombrar](#cómo-nombrar)
  1. [Estructura de la Aplicación El Principio LIFT](#estructura-de-la-aplicación-el-principio-lift)
  1. [Estructura de la Aplicación](#estructura-de-la-aplicación)
  1. [Modularidad](#modularidad)
  1. [Lógica de Arranque](#lógica-de-arranque)
  1. [Animaciones](#animaciones)
  1. [Comentarios](#comentarios)
  1. [JSHint](#js-hint)
  1. [Constantes](#constantes)
  1. [Plantillas y Snippets](#plantillas-y-snippets)
  1. [Ruteo](#ruteo)
  1. [Automatización de Tareas](#automatización-de-tareas)
  1. [Angular Docs](#angularjs-docs)

## Single Responsibility o Responsabilidad Única

### La regla del 1
###### [Style [Y001](#style-y001)]

  - Define 1 componente por archivo.
    
    *¿Por qué?*: Un componente por archivo promueve pruebas unitarias más fáciles.

    *¿Por qué?*: Un componente por archivo hace que sea mucho más fácil de leer, mantener, y evita colisiones con los equipos en el control de código.

    *¿Por qué?*: Un componente por archivo evita errores ocultos que a menudo surgen cuando se combinan componentes en un archivo donde pueden compartir variables, crear closures (clausuras) no deseadas, o acoplamiento indeseado de dependencias.

  El siguiente ejemplo define el módulo `app` y sus dependencias, define un controlador, y defines una fábrica todo en el mismo archivo.

  ```javascript
  /* evitar */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  Los mismos componentes están separados en su propio archivo.

  ```javascript
  /* recomendado */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* recomendado */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomendado */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Volver arriba](#tabla-de-contenidos)**

## IIFE
### Closures de JavaScript
###### [Style [Y010](#style-y010)]

  - Envuelve los componentes Angular en una expresión de función que se invoca inmediatamente Immediately Invoked Function Expression (IIFE).

  *¿Por qué?*: Una IIFE elimina las variables del scope global. Esto ayuda a prevenir que las variables y las declaraciones de funciones vivan más de lo esperado en el scope global, evitando así colisión de variables.

  *¿Por qué?*: Cuando tu código se minimiza y se empaqueta en un archivo único para desplegar al servidor de producción, podrías tener colisión de variables y muchas variables globales. Una IIFE te protege contra ambos, creando una scope por cada archivo.

  ```javascript
  /* evitar */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // La función logger es añadida como variable global
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // la función storage es añadida como variable global
  function storage() { }
  ```

  ```javascript
  /**
   * recomendado
   *
   * así no dejamos ninguna variable global
   */

  // logger.js
  (function() {
      'use strict';

      angular
          .module('app')
          .factory('logger', logger);

      function logger() { }
  })();

  // storage.js
  (function() {
      'use strict';

      angular
          .module('app')
          .factory('storage', storage);

      function storage() { }
  })();
  ```

  - Nota: Para acortar únicamente, el resto de los ejemplos de esta guía podrían omitir la sintaxis IIFE.

  - Nota: IIFE previente que el código de los tests llegue a sus variables privadas, como expresiones regulares o funciones de ayuda que normalmente vienen bien para hacer pruebas por sí solas. Sin embargo, puedes acceder a ellas creando accesorios o accediendo a través de sus componentes. Por ejemplo, poniendo las funciones de ayuda, expresiones regulares o constantes en su propia fábrica.

**[Volver arriba](#tabla-de-contenidos)**

## Módulos

### Evitando la colisión de nombres
###### [Style [Y020](#style-y020)]

  - Use una convención de nombres única con separadores para los sub-módulos.

  *¿Por qué?*: Nombres únicos ayudan a evitar colisiones en los nombres de módulos. Los separadores ayudan a definir los módulos y la jerarquía de sus sub-módulos. Por ejemplo `app` puede ser tu módulo raíz y `app.dashboard` y `app.users` pueden ser módulos que dependen de `app`.

### Definiciones (aka Setters)
###### [Style [Y021](#style-y021)]

  - Declara los módulos sin usar una variable, usando la sintaxis de los setters.

  *¿Por qué?*: Con un componente por archivo, es raro que necesitemos introducir una variable para el módulo.

  ```javascript
  /* evitar */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  En su lugar usa la sintaxis de los setters

  ```javascript
  /* recomendado */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getters
###### [Style [Y022](#style-y022)]

  - Al usar un módulo, evita usar una variable y en su lugar usa encadenamiento con la sintaxis de los getter.

  *¿Por qué?*: Esto hace más legible el código y evita que las variables colisionen.

  ```javascript
  /* evitar */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomendado */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs Getting
###### [Style [Y023](#style-y023)]

  - Setea sólo una vez y usa get para el resto de instancias.

  *¿Por qué?*: Un módulo debe ser creado sólo una vez y recuperado desde ese punto.

    - Usa `angular.module('app', []);` para setear un módulo.
    - Usa `angular.module('app');` para recuperar un módulo.

### Funciones anónimas vs funciones con nombre
###### [Style [Y024](#style-y024)]

  - Usa funciones con nombre en lugar de pasar una función anónima en el callback.

  *¿Por qué?*: Así el código es más legible, es más fácil de debugear, y reduce la cantidad de código anidado en los callbacks.

  ```javascript
  /* evitar */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recomendado */

  // dashboard.js
  angular
      .module('app')
      .controller('Dashboard', Dashboard);

  function Dashboard() { }
  ```

  ```javascript
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  function logger() { }
  ```

**[Volver arriba](#tabla-de-contenidos)**

## Controladores

### controllerAs Sintaxis en la Vista
###### [Style [Y030](#style-y030)]

  - Usa la sintaxis [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) en lugar del `clásico controlador con $scope`.

  *¿Por qué?*: Los Controladores se construyen, renuevan y proporcionan una nueva instancia única, y la sintaxis `controllerAs` se acerca más a eso que la `sintaxis clásica de $scope`.

  *¿Por qué?*: Promueves el uso de binding usando el "." en el objeto dentro de la Vista (ej. `customer.name` en lugar de `name`), así es más contextual, fácil de leer y evitas problemas de referencia que pueden aparecer con el "punto".

  *¿Por qué?*: Ayuda a evitar usar `$parent` en las Vistas con controladores anidados.

  ```html
  <!-- evitar -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recomendado -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs Sintaxis en el Controlador
###### [Style [Y031](#style-y031)]

  - Usa la sintaxis `controllerAs` en lugar del `clásico controlador con $scope`.

  - La sintaxis `controllerAs` usa `this` dentro de los controladores que se asocian al `$scope`

  *¿Por qué?*: `controllerAs` permite una sintaxis más ágil sobre el `$scope`. Puedes enlazar a la vista y acceder a los métodos del `$scope`.

  *¿Por qué?*: Ayuda a evitar la tentación de usar los métodos del `$scope` dentro de un controller cuando debería ser mejor evitar usarlos o moverlos a una factory. Considera usar `$scope` en una factory, o en un controlador sólo cuando sea necesario. Por ejemplo cuando publicas y te suscribes a eventos usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), o [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considera mover estos usos a una factory e invocarlos desde el controlador.

  ```javascript
  /* evitar */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado - pero mira la sección siguiente */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs con vm
###### [Style [Y032](#style-y032)]

  - Usa una variable para capturar `this` cuando uses la sintaxis `controllerAs`. Elige un nombre de variable consistente como `vm`, de ViewModel.

  *¿Por qué?*: La palabra `this` es contextual y cuando es usada dentro de una función en un controlador puede cambiar su contexto. Capturando el contexto de `this` te evita encontrarte este problema.

  ```javascript
  /* evitar */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Nota: Puedes evitar los warnings de [jshint](http://www.jshint.com/) escribiendo un comentario encima de la línea de código. Sin embargo no hace falta si el nombre de la función empieza con mayúsculas, ya que esa es la convención para las funciones de los constructores, que es lo que un controller en Angular es.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

### Miembros Bindeables Arriba
###### [Style [Y033](#style-y033)]

  - Coloca las asociaciones en la parte superior del controlador, ordenalas alfabéticamente y no las distribuyas a lo largo del código del controlador.

    *¿Por qué?*: Colocar las variables asignables arriba hace más fácil la lectura y te ayuda a identificar qué variables del controlador pueden ser asociadas y usadas en la Vista.

    *¿Por qué?*: Setear funciones anónimas puede ser fácil, pero cuando esas funciones tienen más de una línea de código se hace menos legible. Definir las funciones bajo las variables bindeables (las declaraciones de las funciones serán movidas hacia arriba en el proceso de hoisting), hace que los detalles de implementación estén abajo, deja las variables arriba y más sencilla la lectura.

  ```javascript
  /* evitar */
  function Sessions() {
      var vm = this;

      vm.gotoSession = function() {
        /* ... */
      };
      vm.refresh = function() {
        /* ... */
      };
      vm.search = function() {
        /* ... */
      };
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recomendado */
  function Sessions() {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = refresh;
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';

      ////////////

      function gotoSession() {
        /* */
      }

      function refresh() {
        /* */
      }

      function search() {
        /* */
      }
  ```

  Nota: Si la función es de una línea, déjala arriba, siempre y cuando no afecte en la legibilidad.

  ```javascript
  /* evitar */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * líneas
           * de
           * código
           * que afectan a
           * la legibilidad
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recomendado */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Declaraciones de Funciones para Esconder los Detalles de Implementación
###### [Style [Y034](#style-y034)]

  - Declara funciones para ocultar detalles de implementación. Mantén las variables bindeables arriba. Cuando necesites bindear una función a un controlador referencia una función que aparezca después en el archivo. Esto está directamente relacionado con la sección: Miembros Bindeables Arriba. Para más detalles mira [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *¿Por qué?*: Colocar las variables bindeables arriba hace más fácil la lectura y te ayuda a identificar qué variables del controlador pueden ser asociadas y usadas en la Vista.

    *¿Por qué?*: Colocar los detalles de implementación de una función al final del archivo deja la complejidad fuera de vista así puedes ver las cosas importantes arriba.

    *¿Por qué?*: La declaración de las funciones son movidas arriba por el
    proceso de hoisting así que no tenemos que preocuparnos por usar una
    función antes de que sea definida (como la habría si fueran funciones en forma de expresión)

    *¿Por qué?*: No tendrás que preocuparte de que si pones `var a` antes de `var b` se rompa el código porque `a` dependa de `b`.

    *¿Por qué?*: El orden es crítico para las funciones en forma de expresión

  ```javascript
  /**
   * evitar
   * Using function expressions.
   */
  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      var activate = function() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      var getAvengers = function() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }

      vm.getAvengers = getAvengers;

      activate();
  }
  ```

  ```javascript
  /*
   * recomendado
   * Usando declaraciones de funciones y
   * miembros bindeables arriba.
   */
  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.getAvengers = getAvengers;
      vm.title = 'Avengers';

      activate();

      function activate() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      function getAvengers() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```

### Diferir la Lógica del Controlador
###### [Style [Y035](#style-y035)]

  - Difiera la lógica dentro de un controlador delegándola a servicios y factories.

    *¿Por qué?*: La lógica podría ser reutilizada por varios controladores cuando la colocas en un servicio y la expones como una función.

    *¿Por qué?*: La lógica en un servicio puede ser aislada en un test unitario, mientras que la lógica de llamadas en un controlador se puede mockear fácilmente.

    *¿Por qué?*: Elimina dependencias y esconde detalles de implementación del controlador.

  ```javascript

  /* evitar */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
          var settings = {};
          // Get the credit service base URL from config
          // Set credit service required headers
          // Prepare URL query string or data object with request data
          // Add user-identifying info so service gets the right credit limit for this user.
          // Use JSONP for this browser if it doesn't support CORS
          return $http.get(settings)
              .then(function(data) {
               // Unpack JSON data in the response object
                 // to find maxRemainingAmount
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Interpret error
                 // Cope w/ timeout? retry? try alternate service?
                 // Re-reject with appropriate error for a user to see
              });
      };
  }
  ```

  ```javascript
  /* recomendado */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
         return creditService.isOrderTotalOk(vm.total)
      .then(function(isOk) { vm.isCreditOk = isOk; })
            .catch(showServiceError);
      };
  }
  ```

### Mantén tus Controladores Enfocados
###### [Style [Y037](#style-y037)]

  - Define un controlador para una vista, no intentes reutilizar el controlador para otras vistas. En lugar de eso, mueve la lógica que se pueda reutilizar a factories y deja el controlador simple y enfocado en su vista.

    *¿Por qué?*: Reutilizar controladores con varias vistas es arriesgado y necesitarías buena cobertura de tests end to end (e2e) para asegurar que todo funciona bien en la aplicación.

**[Volver arriba](#tabla-de-contenidos)**

## Servicios

### Singletons
###### [Style [Y040](#style-y040)]

  - Los Servicios son instanciados con un `new`, usan `this` para los métodos públicos y las variables. Ya que son muy similares a las factories, usa una factory en su lugar por consistencia.

    Nota: [Todos los servicios Angular son singletons](https://docs.angularjs.org/guide/services). Esto significa que sólo hay una instancia de un servicio por inyector.

  ```javascript
  // service
  angular
      .module('app')
      .service('logger', logger);

  function logger() {
    this.logError = function(msg) {
      /* */
    };
  }
  ```

  ```javascript
  // factory
  angular
      .module('app')
      .factory('logger', logger);

  function logger() {
      return {
          logError: function(msg) {
            /* */
          }
     };
  }
  ```

**[Volver arriba](#tabla-de-contenidos)**

## Factory

### Responsabilidad Única
###### [Style [Y050](#style-y050)]

  - Las factories deben tener una [responsabilidad única](http://en.wikipedia.org/wiki/Single_responsibility_principle), que es encapsulada por su contexto. Cuando una factory empiece a exceder el principio de responsabilidad única, una nueva factory debe ser creada.

### Singletons
###### [Style [Y051](#style-y051)]

  - Las factories son singleton y devuelven un objeto que contiene las variables del servicio.

    Nota: [Todos los servicios Angular son singletons](https://docs.angularjs.org/guide/services).

### Miembros accesibles Arriba
###### [Style [Y052](#style-y052)]

  - Expón las variables que se llaman del servicio (su interfaz) arriba, usando la técnica deribada de [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *¿Por qué?*: Colocar los elementos que se llaman arriba hace más fácil la lectura y te ayuda a identificar los elementos del servicio que se pueden llamar y se deben testear (y/o mockear).

    *¿Por qué?*: Es especialmente útil cuando el archivo se hace más largo, ya que ayuda a evitar el scroll para ver qué se expone.

    *¿Por qué?*: Setear las funciones puede ser fácil, pero cuando tienen más de una línea ser reduce la legibilidad. Definiendo la interfaz mueve los detalles de implementación abajo, mantiene la interfaz que va a ser llamada arriba y lo hace más fácil de leer.

  ```javascript
  /* evitar */
  function dataService() {
    var someValue = '';
    function save() {
      /* */
    };
    function validate() {
      /* */
    };

    return {
        save: save,
        someValue: someValue,
        validate: validate
    };
  }
  ```

  ```javascript
  /* recomendado */
  function dataService() {
      var someValue = '';
      var service = {
          save: save,
          someValue: someValue,
          validate: validate
      };
      return service;

      ////////////

      function save() {
          /* */
      };

      function validate() {
          /* */
      };
  }
  ```

  De esta forma se asocian los bindeos desde el objeto que lo mantiene, los valores primitivos no se pueden modificar por si solos usando este patrón


### Declaración de Funciones para Esconder los Detalles de Implementación
###### [Style [Y053](#style-y053)]

  - Declara funciones para esconder detalles de implementación. Manten los elementos accesibles en la parte superior de la factory. Referencia a los que aparezcan después en el archivo. Para más detalles visita [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *¿Por qué?*: Coloca los elementos accesibles en la parte superior para hacerlo más fácil de leer y ayudarte a identificar instantáneamente qué funciones de la factory se pueden accesar externamente.

    *¿Por qué?*: Colocar los detalles de implementación de una función al final del archivo mueve esa complejidad fuera de la vista, de esta forma puedes dejar lo importante arriba.

    *¿Por qué?*: Las declaraciones de las funciones son "elevadas" de esta forma no hay problemas en usar una función antes de su definición (como la habría si fueran funciones en forma de expresión).

    *¿Por qué?*: No tendrás que preocuparte de que si pones `var a` antes de `var b` se rompa el código porque `a` dependa de `b`.

    *¿Por qué?*: El orden es crítico para las funciones en forma de expresión

  ```javascript
  /**
   * evitar
   * Usar función como expresión
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
          // detalles de implementación van aquí
      };

      var getAvengerCount = function() {
          // detalles de implementación van aquí
      };

      var getAvengersCast = function() {
          // detalles de implementación van aquí
      };

      var prime = function() {
          // detalles de implementación van aquí
      };

      var ready = function(nextPromises) {
          // detalles de implementación van aquí
      };

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;
  }
  ```

  ```javascript
  /**
   * recomendado
   * Usar declaración de funciones
   * y miembros accesibles arriba
   */
  function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;

      ////////////

      function getAvengers() {
          // detalles de implementación van aquí
      }

      function getAvengerCount() {
          // detalles de implementación van aquí
      }

      function getAvengersCast() {
          // detalles de implementación van aquí
      }

      function prime() {
          // detalles de implementación van aquí
      }

      function ready(nextPromises) {
          // detalles de implementación van aquí
      }
  }
  ```

**[Volver arriba](#tabla-de-contenidos)**

## Servicios de Datos

### Separate Data Calls
###### [Style [Y060](#style-y060)]

  - Refactoriza la lógica para hacer operaciones e interaciones con datos en una factory. Crear data services responsables de las peticiones XHR, local storage, memoria o cualquier otra operación con datos.

    *¿Por qué?*: La responsabilidad del controlador es la de presentar y recoger información para la vista. No debe importarle cómo se consiguen los datos, sólo saber cómo conseguirlos. Separando los datos de servicios movemos la lógica de cómo conseguirlos al servicio de datos, y deja el controlador simple, enfocándose en la vista.

    *¿Por qué?*: Hace más fácil testear (mock o real) las llamadas de datos cuando testeamos un controlador que usa un data service.

    *¿Por qué?*: La implementación del servicio de datos puede tener código muy específico para usar el repositorio de datos. Podría incluir cabeceras, cómo hablar a los datos, u otros servicios como $http. Separando la lógica en servicios de datos encapsulamos la lógica en un único lugar, escondiendo la implementación de sus consumidores externos (quizá un controlador), de esta forma es más fácil cambiar la implementación.

  ```javascript
  /* recomendado */

  // dataservice factory
  angular
      .module('app.core')
      .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', 'logger'];

  function dataservice($http, logger) {
      return {
          getAvengers: getAvengers
      };

      function getAvengers() {
          return $http.get('/api/maa')
              .then(getAvengersComplete)
              .catch(getAvengersFailed);

          function getAvengersComplete(response) {
              return response.data.results;
          }

          function getAvengersFailed(error) {
              logger.error('XHR Failed for getAvengers.' + error.data);
          }
      }
  }
  ```

    Nota: El servicio de datos es llamado desde los consumidores, como el controlador, escondiendo la implementación del consumidor como se muestra a continuación.

  ```javascript
  /* recomendado */

  // controller llamando a la factory del data service
  angular
      .module('app.avengers')
      .controller('Avengers', Avengers);

  Avengers.$inject = ['dataservice', 'logger'];

  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];

      activate();

      function activate() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      function getAvengers() {
          return dataservice.getAvengers()
              .then(function(data) {
                  vm.avengers = data;
                  return vm.avengers;
              });
      }
  }
  ```

### Regresa una Promesa desde las Llamadas a Datos
###### [Style [Y061](#style-y061)]

  - Cuando llamamos a servicios de datos que devuelven una promesa como $http, devuelve una promesa en la llamada de tu función también.

    *¿Por qué?*: Puedes encadenar promesas y hacer algo cuando la llamada se complete y resuelva o rechace la promesa.

  ```javascript
  /* recomendado */

  activate();

  function activate() {
      /**
       * Step 1
       * Pide a la función getAvengers por los datos
       * de los vengadores y espera la promesa
       */
      return getAvengers().then(function() {
          /**
           * Step 4
           * Ejecuta una acción cuando se resuelva la promesa final
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Step 2
         * Pide al servicio de datos los datos y espera
         * por la promesa
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Step 3
                 * setea los datos y resuelve la promesa
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Volver arriba](#tabla-de-contenidos)**

## Directivas
### Limitadas a 1 Por Archivo
###### [Style [Y070](#style-y070)]

  - Crea una directiva por archivo. Llama al archivo como la directiva.

    *¿Por qué?*: Es muy fácil colocar todas las directivas en un archivo, pero será más difícil de partir para ser compartida entre aplicaciones, módulos o para un simple módulo.

    *¿Por qué?*: Una directiva por archivo es fácil de mantener.

  ```javascript
  /* evitar */
  /* directives.js */

  angular
      .module('app.widgets')

      /* directiva de órdenes que es específica del módulo de órdenes*/
      .directive('orderCalendarRange', orderCalendarRange)

      /* directiva de ventas que puede ser usada en algún otro lado a lo
      largo de la aplicación de ventas */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* directiva de spinner que puede ser usada a lo largo de las
      aplicaciones */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* detalles de implementación */
  }

  function salesCustomerInfo() {
      /* detalles de implementación */
  }

  function sharedSpinner() {
      /* detalles de implementación */
  }
  ```

  ```javascript
  /* recomendado */
  /* calendarRange.directive.js */

  /**
   * @desc directiva de órdenes que es específica al módulo de órdenes en la compañía Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* detalles de implementación */
  }
  ```

  ```javascript
  /* recomendado */
  /* customerInfo.directive.js */

  /**
   * @desc directiva de ventas que puede ser usada a lo largo de la aplicación de ventas en la compañía Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* detalles de implementación */
  }
  ```

  ```javascript
  /* recomendado */
  /* spinner.directive.js */

  /**
   * @desc directiva de spinner que puede ser usada a lo largo de las aplicaciones en la compañía Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* detalles de implementación */
  }
  ```

    Nota: Hay muchas formas de llamar a las directivas, especialmente cuando pueden ser usadas en ámbitos específicos. Elige un nombre que tenga sentido para la directiva y que su archivo sea distintivo y claro. Hemos visto algunos ejemplos antes, pero veremos más en la sección de cómo nombrar.

### Manipula el DOM en una Directiva
###### [Style [Y072](#style-y072)]

  - Cuando manipules DOM directamente, usa una directiva. Si hay alguna alternativa como usando CSS para cambiar los estilos o los [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) o [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), entonces úsalos en su lugar. Por ejemplo, si la directiva sólo muestra o esconde elementos, usa ngHide/ngShow.

    *¿Por qué?*: Manipular el DOM puede ser difícil de testear, debugear y normalmente hay mejores maneras (e.g. CSS, animations, templates)

### Provee un Prefijo Único de Directiva
###### [Style [Y073](#style-y073)]

  - Proporciona un prefijo corto, único y descriptivo como `acmeSalesCustomerInfo` que se declare en el HTML como `acme-sales-customer-info`.

    *¿Por qué?*: El prefijo corto y único identifica el contexto de la directiva y el origen. Por ejemplo el prefijo `cc-` puede indicar que la directiva en particular es parte de la aplicación CodeCamper, mientras que `acme-` pudiera indicar que la directiva es de la compañía Acme.

    Nota: Evita `ng-` ya que está reservado para las directivas AngularJS. Estudia sabiamente las directivas usadas para evitar conflictos de nombres, como `ion-` de [Ionic Framework](http://ionicframework.com/).

### Limitate a Elementos y Atributos
###### [Style [Y074](#style-y074)]

  - Cuando crees directivas que tengan sentido como elemento, restringe `E` (elemento personalizado) y opcionalmente restringe `A` (atributo personalizado). Generalmente, si puede ser su control propio, `E` es apropiado, La pauta general es permitir `EA` pero intenta implementarlo como un elemento cuando sea un elemento único y como un atributo cuando añada mejoras a su propio elemento existente en el DOM.

    *¿Por qué?*: Tiene sentido.

    *¿Por qué?*: Mientras permitamos que una directiva sea usada como una clase, si esa directiva realmente está actuando como un elemento, tiene sentido que sea un elemento, o al menos un atributo.

    Nota: En Angular 1.3+ EA es el valor por defecto

  ```html
  <!-- evitar -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* evitar */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange() {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'C'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```

  ```html
  <!-- recomendado -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* recomendado */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange() {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'EA'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```

### Directivas y ControllerAs
###### [Style [Y075](#style-y075)]

  - Usa la sintaxis `controller as` con una directiva para ser consistente con el uso de `controller as` con los pares de vista y controlador.

    *¿Por qué?*: Tiene sentido y no es difícil.

    Nota: La siguiente directiva demuestra algunas de las formas en las que puedes usar el scope dentro del link y el controlador de una directiva, usando controllerAs. He puesto la template para dejarlo todo en un lugar.

    Nota: En cuanto a la inyección de dependencias, mira [Identificar Dependencias Manualmente](#manual-annotating-for-dependency-injection).

    Nota: Nótese que el controlador de la directiva está fuera del closure de la directiva. Este estilo elimina los problemas que genera la inyección de dependencias donde la inyección es creada en un código no alcanzable después del `return`.

  ```html
  <div my-example max="77"></div>
  ```

  ```javascript
  angular
      .module('app')
      .directive('myExample', myExample);

  function myExample() {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          link: linkFunc,
          controller: ExampleController,
            controllerAs: 'vm',
            bindToController: true // porque el scope is aislado
        };

      return directive;

      function linkFunc(scope, el, attr, ctrl) {
          console.log('LINK: scope.min = %s *** should be undefined', scope.min);
          console.log('LINK: scope.max = %s *** should be undefined', scope.max);
          console.log('LINK: scope.vm.min = %s', scope.vm.min);
          console.log('LINK: scope.vm.max = %s', scope.vm.max);
      }
  }

  ExampleController.$inject = ['$scope'];

  function ExampleController($scope) {
      // Inyectando el $scope solo para comparación
      var vm = this;

      vm.min = 3;

      console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
      console.log('CTRL: $scope.vm.max = %s', $scope.vm.max);
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
  }
  ```

  ```html
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

###### [Style [Y076](#style-y076)]

  - Usa `bindToController = true` cuando uses `controller as` con una directiva cuando quieras asociar el scope exterior al scope del controller de la directiva.

    *¿Por qué?*: Lo hace más fácil a la hora de asociar el scope exterior al scope del controlador de la directiva.

    Nota: `bindToController` fue introducido en Angular 1.3.0.

  ```html
  <div my-example max="77"></div>
  ```

  ```javascript
  angular
      .module('app')
      .directive('myExample', myExample);

  function myExample() {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          controller: ExampleController,
            controllerAs: 'vm',
            bindToController: true
        };

      return directive;
  }

  function ExampleController() {
      var vm = this;
      vm.min = 3;
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
  }
  ```

  ```html
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[Volver arriba](#tabla-de-contenidos)**

## Resolviendo Promesas en un Controlador

### Promesas de Activación de un Controlador
###### [Style [Y080](#style-y080)]

  - Resuelve la lógica de inicialización de un controlador en una función `activate`.

    *¿Por qué?*: Colocar la lógica de inicialización en un lugar consistente del controlador lo hace más fácil de localizar, más consistente de testear, y ayuda a evitar que la lógica de activación se propage a lo largo del controlador.

    *¿Por qué?*: El `activate` del controlador hace que la lógica para refrescar el controlador/Vista sea reutilizable, mantiene la lógica junta, lleva el usuario a la Vista más rápido, hace las animaciones más fáciles en `ng-view` o `ui-view` y lo hace más rápido a la vista del usuario.

  ```javascript
  /* evitar */
  function Avengers(dataservice) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      dataservice.getAvengers().then(function(data) {
          vm.avengers = data;
          return vm.avengers;
      });
  }
  ```

  ```javascript
  /* recomendado */
  function Avengers(dataservice) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      activate();

      ////////////

      function activate() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```
**[Volver arriba](#tabla-de-contenidos)**

## Anotación Manual para la Inyección de Dependencias

### Insegura después de la Minificación
###### [Style [Y090](#style-y090)]

  - Evita usar la sintaxis acortada para declarar dependencias sin usar algún método que permita minificación.

    *¿Por qué?*: Los parámetros al componente (e.g. controller, factory, etc) se convertirán en variables acortadas. Por ejemplo, `common` y `dataservice` se convertirán `a` o `b` y no serán encontradas por AngularJS.

    ```javascript
    /* evitar - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Este código acortará las variables cuando se minimice y causará errores en tiempo de ejecución.

    ```javascript
    /* evitar - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Identifica Dependencias Manualmente
###### [Style [Y091](#style-y091)]

  - Usa `$inject` Para identificar manualmente las dependencias de tus componentes AngularJS.

    *¿Por qué?*: Esta técnica es la misma que se usa con [`ng-annotate`](https://github.com/olov/ng-annotate), la cuál recomiendo para automatizar la creación de dependencias minificadas de forma segura. Si `ng-annotate` detecta que la inyección ha sido hecha, no la duplicará.

    *¿Por qué?*: Esto salvaguarda tus dependencias de ser vulnerables de problemas a la hora de minimizar cuando los parámetros se acorten. Por ejemplo, `common` y `dataservice` se convertirán `a` o `b` y no serán encontradas por AngularJS.

    *¿Por qué?*: Evita crear dependencias en línea, ya que las listas largas pueden ser difícil de leer en el arreglo. También puede ser confuso que el arreglo sea una serie de cadenas mientras que el último componente es una función.

    ```javascript
    /* evitar */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* evitar */
    angular
      .module('app')
      .controller('Dashboard',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recomendado */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Nota: Cuando tu función está debajo de un return, $inject puede ser inalcanzable (esto puede pasar en una directiva). Puedes solucionarlo moviendo el $inject encima del return o usando la sintaxis de arreglo para inyectar.

    Nota: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduce una funcionalidad donde mueve `$inject` donde es alcanzable.

    ```javascript
    // dentro de la definición de una directiva
    function outer() {
        return {
            controller: DashboardPanel,
        };

        DashboardPanel.$inject = ['logger']; // Inalcanzable
        function DashboardPanel(logger) {
        }
    }
    ```

    ```javascript
    // dentro de la definición de una directiva
    function outer() {
        DashboardPanel.$inject = ['logger']; // alcanzable
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```
**[Volver arriba](#tabla-de-contenidos)**

## Minificación y Anotación

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Usa [ng-annotate](//github.com/olov/ng-annotate) para [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) y comenta funciones que necesiten inyección de dependencias automatizadas usando `/** @ngInject */`

    *¿Por qué?*: Salvaguarda tu código de cualquier dependencia que pueda no estar usando prácticas de minificación segura.

    *¿Por qué?*: [`ng-min`](https://github.com/btford/ngmin) está obsoleto

    El siguiente código no está usando minificación de dependencias segura.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }
    ```

    Cuando el código de arriba es ejecutado a través de ng-annotate producirá la siguiente salida con la anotación `$inject` y será seguro para ser minificado.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storageService', 'avengerService'];
    ```

    Nota: Si `ng-annotate` detecta que la inyección ya ha sido hecha (e.g. `@ngInject` fué detectado), no duplicará el código de `$inject`.

### Usa Gulp o Grunt para ng-annotate
###### [Style [Y101](#style-y101)]

  - Usa [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) o [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) en una tarea de construcción automática. Inyecta `/* @ngInject */` antes de cualquier función que tenga dependecias.

    *¿Por qué?*: ng-annotate atrapará la mayoría de las dependencias, pero algunas veces requiere indicios usando la sintaxis `/* @ngInject */`.

    El código siguiente es un ejemplo de una tarea de Gulp que usa
    ngAnnotate

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;
        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Agrega la notación antes de ofuscar para que el código sea minificicado apropiadamente.
            .pipe(ngAnnotate({
                // true ayuda a añadir @ngInject donde no es usado. Infiere.
                // No funciona con resolve, así que tenemos que ser explícitos en ese caso
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[Volver arriba](#tabla-de-contenidos)**

## Cómo Nombrar

### Pautas para nombrar
###### [Style [Y120](#style-y120)]

  - Usa nombres consistentes para todos los componentes siguiendo un patrón que describa las características del componente y después (opcionalmente) su tipo. Mi patrón recomendado es `feature.type.js`. Hay dos nombres para la mayoría de los assets:
    * el nombre del archivo (`avengers.controller.js`)
    * el nombre del componente registrado en Angular (`AvengersController`)

    *¿Por qué?*: Las pautas de como nombrar nos ayudan a proveer una manera consistente para encontrar contenido en un vistazo. La Consistencia es vital dentro del proyecto. La Consistencia es importante dentro de un equipo. La Consistencia a lo largo de una compañía provee de una tremenda eficacia.

    *¿Por qué?*: Las pautas para nombrar deberían simplemente ayudarte a encontrar tu código rápidamente y hacerlo más fácil de entender.

### Nombres de Archivo para Característica
###### [Style [Y121](#style-y121)]

  - Usa nombres consistentes para todos los componentes siguiendo un patrón que describa la característica o feature del componente y después (opcionalmente) su tipo. Mi patrón recomendado es `feature.type.js`.

    *¿Por qué?*: Provee de una manera consistente para identificar componentes rápidamente.

    *¿Por qué?*: Provee un patrón de coincidencia para tareas automatizadas.

    ```javascript
    /**
     * opciones comunes
     */

    // Controladores
    avengers.js
    avengers.controller.js
    avengersController.js

    // Servicios/Factories
    logger.js
    logger.service.js
    loggerService.js
    ```

    ```javascript
    /**
     * recomendado
     */

    // controllers
    avengers.controller.js
    avengers.controller.spec.js

    // servicios/factories
    logger.service.js
    logger.service.spec.js

    // constantes
    constants.js

    // definición de módulos
    avengers.module.js

    // rutas
    avengers.routes.js
    avengers.routes.spec.js

    // configuración
    avengers.config.js

    // directivas
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

### Nombres de Controladores
###### [Style [Y123](#style-y123)]

  - Usa nombres consistentes para todos los controladores nombrados a partir de lo que hacen. Usa UpperCamelCase para controladores, ya que son constructores.

    *¿Por qué?*: Provee de una manera consistente de identificar y referenciar controladores rápidamente.

    *¿Por qué?*: UpperCamelCase es convencional para identificar objetos que pueden ser instanciados usando un constructor.

    ```javascript
    /**
     * recomendado
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers() { }
    ```

### Sufijo para el Nombre del Controlador
###### [Style [Y124](#style-y124)]

  - Agrega el sufijo `Controller` al nombre del controlador.

    *¿Por qué?*: El sufijo `Controller` es usado más comúnmente y es más descriptivo explícitamente.

    ```javascript
    /**
     * recomendado
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Nombres de Factory
###### [Style [Y125](#style-y125)]

  - Usa nombres consistentes para todas las factories nombradas a partir de lo que hacen. Usa camel-casing para los servicios y las factories.

    *¿Por qué?*: Provee una manera consistente de identificar y referenciar factories rápidamente.

    ```javascript
    /**
     * recomendado
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

### Nombres para Directivas
###### [Style [Y126](#style-y126)]

  - Usa nombres consistentes para todas las directivas usando camel-case. Usa un prefijo corto para describir el área a la que la directiva pertenece (algunos ejemplos son un prefijo según la compañía o un prefijo según el proyecto).

    *¿Por qué?*: Provee una manera consistente de identificar y referenciar componentes rápidamente.

    ```javascript
    /**
     * recomendado
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // el uso es <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Módulos
###### [Style [Y127](#style-y127)]

  - Cuando haya múltiples módulos, el archivo del módulo principal es nombrado `app.module.js` mientras que otros módulos que dependan de él son nombrados a partir de lo que ellos representan. Por ejemplo, un módulo de admin es nombrado `admin.module.js`. Los nombres de los módulos registrados serán respectivamente `app` y `admin`.

    *¿Por qué?*: Provee consistencia para múltiples módulos de aplicación, y para poder expandirse a aplicaciones más grandes.

    *¿Por qué?*: Provee una manera fácil de usar tareas automatizadas para cargar todas las definiciones de módulos primero, y luego todos los otros archivos de angular (agrupación).

### Configuración
###### [Style [Y128](#style-y128)]

  - Separa la configuración de un módulo en un archivo propio nombrado a partir del nombre del módulo. Un archivo de configuración para el módulo principal de `app` es nombrado `app.config.js` (o simplemente `config.js`). La configuración para un módulo llamado `admin.module.js` es nombrada `admin.config.js`.

    *¿Por qué?*: Separa la configuración de la definición del módulo, componentes y código activo.

    *¿Por qué?*: Provee un lugar identificable para establecer configuración para un módulo.

### Rutas
###### [Style [Y129](#style-y129)]

  - Separa la configuración de la ruta en un archivo propio. Algunos ejemplos pueden ser `app.route.js` para el módulo principal y `admin.route.js`  para el módulo admin `admin`. Incluso en aplicaciones pequeñas prefiero esta separación del resto de la configuración.

**[Volver arriba](#tabla-de-contenidos)**

## Estructura de la Aplicación El Principio LIFT
### LIFT
###### [Style [Y140](#style-y140)]

  - Estructura tu aplicación de tal manera que puedas Localizar (`L`ocate) tu código rápidamente, Identificar (`I`dentify) el código de un vistazo, mantener la estructura más plana (`F`lattest) que puedas, y Trata (`T`ry) de mantenerte DRY. La estructura debe de seguir estas 4 pautas básicas.

    *¿Por qué LIFT?*: Provee una estructura consistente que escala bien, es modular, y hace más fácil incrementar la eficiencia de los desarrolladores al encontrar código rápidamente. Otra manera de checar la estructura de tu aplicación es preguntarte a ti mismo: ¿Qué tan rápido puede abrir y trabajar en todos los archivos relacionados a una caracteristica?

    Cuando encuentro que mi estructura no se siente cómoda, regreso y reviso estas pautas LIFT

    1. `L`ocating - Localizar nuestro código es fácil
    2. `I`dentify - Identificar código de un vistazo
    3. `F`lat - Estructura plana tanto como sea posible
    4. `T`ry - Tratar de mantenerse DRY (Don't Repeat Yourself) or T-DRY

### Localizar
###### [Style [Y141](#style-y141)]

  - Has que la localización tu código sea intuitivo, simple y rápido.

    *¿Por qué?*: Encuentro que esto es super importante para un proyecto. Si el equipo no puede encontrar los archivos en los que necesita trabajar rápidamente, no podrán trabajar tan eficientemente como sea posible, y la estructura necesita cambiar. Puede que no conozcas el nombre del archivo o donde están sus archivos relacionados, así que poniéndolos en las locaciones más intuitivas y cerca de los otros ahorra mucho tiempo. Una estructura de directorios descriptiva puede ayudar con esto.


### Identificar
###### [Style [Y142](#style-y142)]

  - Cuando miras en un archivo deberías saber instantáneamente qué contiene y qué representa.

    *¿Por qué?*: Gastas menos tiempo buscando y urgando por código, y es más eficiente. Si esto significa que quieres nombres de archivos más largos, entonces que así sea. Se descriptivo con los nombres de los archivos y mantén el contenido del archivo a exactamente 1 componente. Evita archivos con múltiples controladores, o una mezcla. Hay excepciones a la regla de 1 por archivo cuando tengo un conjunto de pequeñas features que están relacionadas unas con otras, aún así son fácilmente identificables.

### Estructura Plana
###### [Style [Y143](#style-y143)]

  - Mantén una estructura de directorios plana tanto como sea posible. Cuando llegues a un total de 7+ archivos, comienza a considerar separación.

    *¿Por qué?*: Nadie quiere buscar en 7 niveles de directorios por un arhivo. Piensa en los menús de los sitios web … cualquiera más profundo que 2 debería ser seriamente considerado. En una estructura de directorios no hay una regla dura o rápida en cuanto a un número, pero cuando un directorio tiene de 7 a 10 archivos, tal vez ese sea el momento para empezar a crear subdirectorios. Básate en tu nivel de confort. Usa una estructura más plana hasta que haya un valor obvio (para ayudar al resto de LIFT) en crear un nuevo directorio.

### T-DRY (Try to Stick to DRY - Trata de Apegarte a DRY)
###### [Style [Y144](#style-y144)]

  - Se DRY, pero no te vuelvas loco y sacrifiques legibilidad.

    *¿Por qué?*: Ser DRY es importante, pero no crucial si sacrifica otras partes de LIFT, es por eso que lo llamo T-DRY. No quiero escribir session-view.html por una vista porque, obviamente es una vista. Si no es obvio o por convención, entonces la nombro así.

**[Volver arriba](#tabla-de-contenidos)**

## Estructura de la Aplicación

### Estructura de Carpetas-por-Característica
###### [Style [Y152](#style-y152)]

  - Crea carpetas llamadas de acuerdo al característica que representan. Cuando una carpeta crezca para contener más de 7 archivos, comienza a considerar la creación de una carpeta para ellos. Tu límite puede ser diferente, así que ajusta de acuerdo a tus necesidades.

    *¿Por qué?*: Un desarrollador puede localizar el código, identificar cada qué representa cada archivo de un vistazo, la estructura es tan plana como puede ser, y no hay nombres repetidos o redundantes.

    *¿Por qué?*: Las pautas LIFT estarán cubiertas.

    *¿Por qué?*: Ayuda a evitar que la aplicación se sature a través de organizar el contenido y conservarlo alineado con las pautas LIFT.

    *¿Por qué?*: Cuando hay demasiados archivos (10+) localizarlos es más fácil con una estructura de directorios consistente y más difíciles en una estructura plana.

    ```javascript
    /**
     * recomendado
     */

    app/
        app.module.js
        app.config.js
        app.routes.js
        components/
            calendar.directive.js
            calendar.directive.html
            user-profile.directive.js
            user-profile.directive.html
        layout/
            shell.html
            shell.controller.js
            topnav.html
            topnav.controller.js
        people/
            attendees.html
            attendees.controller.js
            speakers.html
            speakers.controller.js
            speaker-detail.html
            speaker-detail.controller.js
        services/
            data.service.js
            localstorage.service.js
            logger.service.js
            spinner.service.js
        sessions/
            sessions.html
            sessions.controller.js
            session-detail.html
            session-detail.controller.js
    ```
      Nota: No estructures tu aplicación usando directorios-por-tipo. Esto requiere mover múltiples directorios cuando se está trabajando en una característica y se vuelve difícil de manejar conforme la aplicación crece a 5, 10 o 25+ vistas y controladores (y otras características), lo que lo hace más difícil que localizar archivos en una aplicación estructura en directorios-por-característica.

**[Volver arriba](#tabla-de-contenidos)**

## Modularidad

### Muy Pequeños, Módulos Autocontenidos
###### [Style [Y160](#style-y160)]

  - Crea módulos pequeños que encapsulen una responsabilidad.

    *¿Por qué?*: Aplicaciones modulares hace más fácil el plug and go ya que permiten a los equipos de desarrollo construir porciones verticales de la aplicación y lanzarlas incrementalmente. Esto significa que podemos conectar nuevas características conforme las desarrollamos.

### Crea un Módulo App
###### [Style [Y161](#style-y161)]

  - Crea una módulo raíz de aplicación cuyo rol sea unir todos los módulos y características de tu aplicación. Nombra éste de acuerdo a tu aplicación.

    *¿Por qué?*: Angular incentiva la modularidad y patrones de separación. Crear un módulo raíz de aplicación cuyo rol es atar otros módulos juntos provee una manera muy directa de agregar o remover módulos de tu aplicación.

### Mantén el Módulo App Delgado
###### [Style [Y162](#style-y162)]

  - Solo coloca lógica para unir la aplicación en el módulo app. Deja las características en sus propios módulos.

    *¿Por qué?*: Agregar roles adicionales a la aplicación raíz para obtener datos remotos, mostrar vistas, u otra lógica no relaciona a la unión de la aplicación enturbia el módulo app y hace ambos conjuntos de características difíciles de reusar y apagar.

    *¿Por qué?*: El módulo app se convierte en el manifiesto que describe qué módulos definen la aplicación.

### Bloques Reusables son Módulos
###### [Style [Y164](#style-y164)]

  - Crea módulos que representen bloques de la aplicación reusables para servicios cómunes como manejo de excepciones, logeo, diagnóstico, seguridad, y almacenamiento local de datos.

    *¿Por qué?*: Este tipo de características son necesarias en muchas aplicaciones, así que mantenerlas separadas en sus propios módulos pueden ser genéricas de aplicación y pueden ser reusadas a lo largo de varias aplicaciones.

### Dependencias de Módulos
###### [Style [Y165](#style-y165)]

  - El módulo raíz de la aplicación depende de módulos de características específicas y cualquier módulo compartido o reusable.

    *¿Por qué?*: El módulo principal de la aplicación contiene un manifiesto rápidamente identificable de las características de la aplicación.

    *¿Por qué?*: Cada área de características contiene un manifiesto de lo que depende, así que puede ser extraído como dependencia en otras aplicaciones y seguir funcionando.

    *¿Por qué?*: Características internas de la aplicación como servicios de datos compartidos se hacen fácil de localizar y compartir desde `app.core` (elije tu nombre favorito para este módulo).

    Nota: Esta es una estrategia para consistencia. Hay muy buenas opciones aquí. Escoge una que sea consistente, que siga las reglas de dependencias de AngularJS, y que sea fácil de mantener y escalar.

    > Mis estructuras varían ligeramente entre proyectos pero todas ellas siguen estas pautas para estructuras y modularidad. La implementación puede variar dependiendo de las características y el equipo. En otras palabras, no te quedes colgado en una estructura igual pero justifica tu estructura usando consistencia, mantenibilidad, y eficacia en mente.

    > En una aplicación pequeña, también puedes considerar poner todas las dependencias compartidas en el módulo principal dónde los módulos de características no tienen dependencias directas. Esto hace más fácil mantener aplicaciones pequeñas, pero hace más difícil el reusar módulos fuera de esta aplicación.

**[Volver arriba](#tabla-de-contenidos)**

## Lógica de Arranque

### Configuración
###### [Style [Y170](#style-y170)]

  - Inyecta código dentro de [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) que necesite ser configurado antes de correr la aplicación angular. Candidatos ideales incluyen providers y constantes.

    *¿Por qué?*: Esto hace más fácil tener menos lugares para la configuración.

  ```javascript
  angular
      .module('app')
      .config(configure);

  configure.$inject =
      ['routerHelperProvider', 'exceptionHandlerProvider', 'toastr'];

  function configure (routerHelperProvider, exceptionHandlerProvider, toastr) {
      exceptionHandlerProvider.configure(config.appErrorPrefix);
      configureStateHelper();

      toastr.options.timeOut = 4000;
      toastr.options.positionClass = 'toast-bottom-right';

      ////////////////

      function configureStateHelper() {
          routerHelperProvider.configure({
              docTitle: 'NG-Modular: '
          });
      }
  }
  ```

**[Volver arriba](#tabla-de-contenidos)**

## Animaciones

### Uso
###### [Style [Y210](#style-y210)]

  - Usa sutiles [animaciones con AngularJS](https://docs.angularjs.org/guide/animations) para hacer transiciones entre estados en vistas y elementos visuales primarios. Incluye el [módulo ngAnimate](https://docs.angularjs.org/api/ngAnimate). Las 3 claves son sutil, fluido, transparente.

    *¿Por qué?*: Animaciones sutiles pueden mejorar la Experiencia de Usuario cuando son usadas apropiadamente.

    *¿Por qué?*: Animaciones sutiles pueden mejorar el rendimiento percibido como una transición de vista.

### Sub Segundos
###### [Style [Y211](#style-y211)]

  - Usa duraciones cortas para las animaciones. Yo generalmente empiezo con 300ms y ajusto hasta que es apropiado.

    *¿Por qué?*: Animaciones largas pueden tener el efecto contrario en la Experiencia de Usuario y el rendimiento percibido al dar la apariencia de una aplicación lenta.

### animate.css
###### [Style [Y212](#style-y212)]

  - Usa [animate.css](http://daneden.github.io/animate.css/) para animaciones convencionales.

    *¿Por qué?*: Las animaciones que animate.css provee son rápidas, fluidas, y fáciles de agregar en tu aplicación.

    *¿Por qué?*: Provee consistencia en tus animaciones.

    *¿Por qué?*: animate.css está ampliamente usado y testeado.

    Nota: Ve este [ excelente post de Matias Niemelä sobre animaciones AngularJS](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Volver arriba](#tabla-de-contenidos)**

## Comentarios

### jsDoc
###### [Style [Y220](#style-y220)]

  - Si planeas producir documentación, usa la sintaxis [`jsDoc`](http://usejsdoc.org/) para documentar nombres de funciones, descripción, parámetros y devoluciones. Usa `@namespace` y `@memberOf` para igualar la estructura de tu aplicación.

    *¿Por qué?*: Puedes generar (y regenerar) documentación desde tu código, en lugar de escribirla desde cero.

    *¿Por qué?*: Provee consistencia al usar una herramienta industrial común.

    ```javascript
    /**
     * Logger Factory
     * @namespace Factories
     */
    (function() {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Application wide logger
       * @memberOf Factories
       */
      function logger($log) {
          var service = {
             logError: logError
          };
          return service;

          ////////////

          /**
           * @name logError
           * @desc Logs errors
           * @param {String} msg Message to log
           * @returns {String}
           * @memberOf Factories.Logger
           */
          function logError(msg) {
              var loggedMsg = 'Error: ' + msg;
              $log.error(loggedMsg);
              return loggedMsg;
          };
      }
    })();
    ```

**[Volver arriba](#tabla-de-contenidos)**

## JS Hint

### Usa un Archivo de Opciones
###### [Style [Y230](#style-y230)]

  - Usa JS Hint para resaltar problemas en tu JavaScript y asegurate de personalizar el arhivo de opciones de JS Hint e incluirlo en el control de versiones. Ve los [JS Hint docs](http://www.jshint.com/docs/) para detalles sobre estas opciones.

    *¿Por qué?*: Provee una primera alerta antes de hacer commit de cualquier código al control de versiones.

    *¿Por qué?*: Provee consistencia a lo largo de tu equipo.

    ```javascript
    {
        "bitwise": true,
        "camelcase": true,
        "curly": true,
        "eqeqeq": true,
        "es3": false,
        "forin": true,
        "freeze": true,
        "immed": true,
        "indent": 4,
        "latedef": "nofunc",
        "newcap": true,
        "noarg": true,
        "noempty": true,
        "nonbsp": true,
        "nonew": true,
        "plusplus": false,
        "quotmark": "single",
        "undef": true,
        "unused": false,
        "strict": false,
        "maxparams": 10,
        "maxdepth": 5,
        "maxstatements": 40,
        "maxcomplexity": 8,
        "maxlen": 120,

        "asi": false,
        "boss": false,
        "debug": false,
        "eqnull": true,
        "esnext": false,
        "evil": false,
        "expr": false,
        "funcscope": false,
        "globalstrict": false,
        "iterator": false,
        "lastsemic": false,
        "laxbreak": false,
        "laxcomma": false,
        "loopfunc": true,
        "maxerr": false,
        "moz": false,
        "multistr": false,
        "notypeof": false,
        "proto": false,
        "scripturl": false,
        "shadow": false,
        "sub": true,
        "supernew": false,
        "validthis": false,
        "noyield": false,

        "browser": true,
        "node": true,

        "globals": {
            "angular": false,
            "$": false
        }
    }
    ```

**[Volver arriba](#tabla-de-contenidos)**

## Constantes

### Globales de Vendor
###### [Style [Y241](#style-y241)]

  - Usa constantes para valores que no cambian y no vienen de otro servicio. Cuando las constantes son usadas solo por para un módulo que pueda ser reutilizado en múltiples aplicaciones, coloca las constantes en un archivo por módulo nombrado a partir del módulo. Hasta que esto sea requerido, mantén las constantes en el módulo principal en un archivo `constants.js`.

    *¿Por qué?*: Un valor que puede cambiar, incluso infrecuentemente, debería ser obtenido desde un servicio así no tendrás que cambiar el código fuente. Por ejemplo, una url para un servicio de datos puede ser colocada en una constante pero un mejor lugar sería cargarla desde un servicio web.

    *¿Por qué?*: Las Constantes pueden ser inyectadas en cualquier componente de angular, incluyendo providers.

    *¿Por qué?*: Cuando una aplicación es separada en módulos que pueden ser reutilizados en otras aplicaciones, cada módulo autónomo debería ser capaz de operar por sí mismo incluyendo cualquier constante de la cual dependa.

    ```javascript
    // Constantes usadas por la aplicación entera
    angular
        .module('app.core')
        .constant('moment', moment);

    // Constantes usadas solo por el módulo de ventas
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[Volver arriba](#tabla-de-contenidos)**

## Plantillas y Snippets
Usa Plantillas o snippets para ayudarte a seguir estilos consistentes o patrones. Aquí hay plantillas y/o snippets para algunos de los editores de desarrollo web e IDEs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Snippets de Angular que siguen estos estilos y directrices.

    - Descarga los [snippets de Angular para Sublime](../assets/sublime-angular-snippets?raw=true)
    - Colócalos en tu directorio de Packages
    - Reinicia Sublime
    - En un archivo de JavaScript escibe estos comandos seguidos de un `TAB`

    ```javascript
    ngcontroller // crea un controlador de Angular
    ngdirective // crea una directiva de Angular
    ngfactory // crea una factory de Angular
    ngmodule // crea un módulo de Angular
    ```

### Atom
###### [Style [Y253](#style-y253)]

  - Angular snippets that follow these styles and guidelines.
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    - Open Atom, then open the Package Manager (Packages -> Settings View -> Install Packages/Themes)
    - Search for the package 'angularjs-styleguide-snippets'
    - Click 'Install' to install the package

  - In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective // creates an Angular directive
    ngfactory // creates an Angular factory
    ngmodule // creates an Angular module
    ngservice // creates an Angular service
    ngfilter // creates an Angular filter
    ```


**[Volver arriba](#tabla-de-contenidos)**

## Ruteo
Enrutamiento del lado del Cliente es importante para crear un flujo de navegación entre vistas y vistas de composición que están hechas de muchas pequeñas plantillas y directivas.

###### [Style [Y270](#style-y270)]

  - Usa el [AngularUI Router](http://angular-ui.github.io/ui-router/) para ruteo del lado del cliente.

    *¿Por qué?*: UI Router ofrece todas las características del router de Angular mas algunas adicionales incluyendo rutas anidadas y estados.

    *¿Por qué?*: La sintaxis es bastante similar al router de Angular y es fácil de migrar al UI Router.

###### [Style [Y271](#style-y271)]

  - Define rutas para vistas en el módulo dónde éstas existen. Cada módulo debería contener las rutas para las vistas en ese módulo.

    *¿Por qué?*: Cada módulo debe ser capaz de funcionar por sí mismo.

    *¿Por qué?*: Al remover un módulo o al agregar un módulo, la aplicación solo contendrá rutas que apunten a las vistas existentes.

    *¿Por qué?*: Esto hace más fácil habilitar o deshabilitar porciones de una aplicación sin preocuparse de rutas huérfanas.

**[Volver arriba](#tabla-de-contenidos)**

## Automatización de Tareas
Usa [Gulp](http://gulpjs.com) o [Grunt](http://gruntjs.com) para crear tareas automatizadas. Gulp deriva a código sobre configuración mientras que Grunt deriva a configuración sobre código.

###### [Style [Y400](#style-y400)]

  - Usa automatización de tareas para listar archivos que definan módulos `*.module.js` antes que otros archivos de JavaScript en la aplicación.

    *¿Por qué?*: Angular necesita la definición de módulos para ser registrados antes de que sean usados.

    *¿Por qué?*: Nombra módulos con un patrón específico como `*.module.js` hace más fácil tomarlos con un glob y listarlos primero.

    ```javascript
    var clientApp = './src/client/app/';

    // Siempre toma archivos de módulos primero
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Volver arriba](#tabla-de-contenidos)**

## Angular docs
Para cualquier otra cosa, refiérete a la API, mira la [documentación de Angular](//docs.angularjs.org/api).

**[Volver arriba](#tabla-de-contenidos)**
