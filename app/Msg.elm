module Msg exposing (..)

import Http

type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
