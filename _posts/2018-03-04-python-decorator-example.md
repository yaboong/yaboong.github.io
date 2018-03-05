---
layout: post
title: "파이썬 데코레이터"
date: 2018-03-04
banner_image: /banner/python.png"
categories: [python]
tags: [python]
---

### 개요
파이썬 데코레이터에 대한 간단한 설명과 예제
<!--more-->

Udacity 에서 {% include href.html text="Designing RESTful APIs" url="https://www.udacity.com/course/designing-restful-apis--ud388" %}
강의를 듣다가  
```javascript
@app.route('/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'token': token.decode('ascii')})
```

이런 코드를 보게 됐다. route 의 경우, flask 에서는 이렇게 사용하는구나 하고 사실 아무생각없이 사용하고 있었다.
그런데 <mark>@auth.login_required</mark> 는 좀 낯설어서 뭔지 찾아보니 <mark>decorator</mark> 라는 녀석이었다.
자바의 어노테이션 같은 것이라 생각했는데, 메타데이터(데이터에 대한 데이터)의 역할을 하는 자바의 어노테이션과는 비슷하지만 좀 다르다.

<br/>


### 데코레이터
파이썬의 데코레이터는 함수를 decoration(장식) 하는 함수다. 
데코레이터는 어떤 함수가 실행되기 전에 먼저 실행되는 함수를 말한다.
어떤 함수를 다른 함수로 감쌀 수 있는 방법인데, 감싸는 것에 장식한다는 의미를 붙여서 decorator 라고 부르는 것 같다.
<mark>@staticmethod</mark>, <mark>@classicmethod</mark> 와 같은 것들이 데코레이터다.

<br/>

### 데코레이터 만들기 1 - 기초
먼저 <mark>import functools</mark> 혹은 <mark>from functools import wraps</mark> 를 import 해줘야 한다.
아이러니 하지만 데코레이터를 만드는 데에도 데코레이터가 사용된다.
wraps 라는 함수는 데코레이터를 만드는데 사용되는 데코레이터이다.

데코레이터의 정의는 아래와 같은 과정으로 한다.
* 데코레이터로 쓰일 함수를 정의한다.
* 내부에 @wraps 라는 데코레이터를 사용하여, 파라미터로 받은 함수를 감쌀 함수를 정의한다.
* 파라미터로 받은 함수를 실행하기 전과 후에 필요한 로직을 넣는다.
* wrap 한 함수를 리턴한다.

아래는 데코레이터를 정의하고 사용하는 예제 코드이다.
```python
from functools import wraps


def my_decorator(func):
    @wraps(func)
    def runs_func():
        print("This is ")
        func()
        print("blog")
    return runs_func


@my_decorator
def my_func():
    print("yaboong's ")


my_func()
```

동작하는 과정은 아래와 같다.
* my_func() 실행! 하려다가 하지않고
* 데코레이터 함수인 my_decorator 에 my_func() 함수를 인자로 넘겨줌
* my_decorator() 함수 실행
* return runs_func 에 의해 runs_func() 함수 실행
* runs_func() 함수가 실행 되면서 인자로 받은 func 즉, my_func() 가 실행됨


<br/>

### 데코레이터 만들기 2 - 약간의 응용
위에서 작성한 데코레이터를 적용하는 함수 my_func() 는 파라미터가 없었다. 파라미터가 있는 함수에 데코레이터를 적용해보자.
그리고, 어딘가에 저장되어 있는 권한에 대한 정보를 가져와서 'admin' 이면 어떤 함수를 실행하고 'admin' 이 아닌 경우 권한이 없음을 나타내는
login_required 데코레이터를 만들어보자.

```python
from functools import wraps

AUTH_INFO = 'admin'
DB = {}


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if AUTH_INFO == 'admin':
            f(*args, **kwargs)
            print('update success')
        else:
            print('no permission')
    return decorated


@login_required
def update_data(data1, data2):
    DB['data1'] = data1
    DB['data2'] = data2


update_data(1, 2)
print(DB)
```

AUTH_INFO 는 어딘가에서 가지고 온 것이라 가정하고 보면, 데이터베이스의 갱신을 수행하는 update_data() 함수는 login_required 데코레이터를 적용하여
권한이 admin 인 경우에만 갱신을 할 수 있도록 만들 수 있다.

이때, 데코레이터를 적용하여 데코레이터 내부에서 실행되는 update_data() 함수의 파라미터는 *args, **kwargs 로 전달한다.

동작하는 과정은 데코레이터 만들기 1 에서 했던 것과 거의 비슷하다.
* update_data() 실행! 하려다가 하지않고
* 데코레이터 함수인 login_required 에 update_date() 함수를 인자로 넘겨줌, f 라는 파라미터로 받음.
    * 이때, 인자 1, 2 는 *args 로 전달됨
    * 호출시 update_data(x=1, y=2) 형태라면 **kwargs 에 {'x':1, 'y':2} 형태로 전달됨
    * 위 코드의 경우 *args 는 <mark>{tuple} <class 'tuple'>: (1, 2)</mark>, **kwargs 는 <mark>{dict} {}</mark> 임 
* login_required() 함수 실행
* return decorated 에 의해 decorated() 함수 실행
* decorated() 함수가 실행 되면서 인자로 받은 f 즉, update_data() 가 실행됨

<br/>

실제 Flask 에서 (HTTPAuth 를 상속받아 구현한 HTTPBasicAuth 클래스의) login_required 함수는 데코레이터로 아래와 같은 방법으로 사용된다.
```python
@app.route('/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'token': token.decode('ascii')})
```

<br/>
Flask 의 login_required() 함수는 아래와 같이 생겼다.

```python
def login_required(self, f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if auth is None and 'Authorization' in request.headers:
            # Flask/Werkzeug do not recognize any authentication types
            # other than Basic or Digest, so here we parse the header by
            # hand
            try:
                auth_type, token = request.headers['Authorization'].split(
                    None, 1)
                auth = Authorization(auth_type, {'token': token})
            except ValueError:
                # The Authorization header is either empty or has no token
                pass

        # if the auth type does not match, we act as if there is no auth
        # this is better than failing directly, as it allows the callback
        # to handle special cases, like supporting multiple auth types
        if auth is not None and auth.type.lower() != self.scheme.lower():
            auth = None

        # Flask normally handles OPTIONS requests on its own, but in the
        # case it is configured to forward those to the application, we
        # need to ignore authentication headers and let the request through
        # to avoid unwanted interactions with CORS.
        if request.method != 'OPTIONS':  # pragma: no cover
            if auth and auth.username:
                password = self.get_password_callback(auth.username)
            else:
                password = None
            if not self.authenticate(auth, password):
                # Clear TCP receive buffer of any pending data
                request.data
                return self.auth_error_callback()

        return f(*args, **kwargs)
    return decorated
```

<br/>

### 정리
데코레이터는 작성하기에는 조금 헷갈릴 수 있지만 다양한 방식으로 유용하게 쓰일 수 있다. (권한처리, 로깅, 유효성검사 등등)

login_required 함수 같은 것을 굳이 데코레이터를 사용하지 않고 어떤 함수 내부에서 호출하여 권한이 있는지 없는지를 판단 할 수도 있지만
데코레이터를 사용하면 좀 더 우아하게 관심사를 분리한 코드를 만들 수 있다.

<br/>


### 참고한 자료
* {% include href.html text="5 reasons you need to learn to write Python decorators" url="https://www.oreilly.com/ideas/5-reasons-you-need-to-learn-to-write-python-decorators"%}


 