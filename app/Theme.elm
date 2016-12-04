module Theme exposing (..)

import Model exposing (Theme)
import Messages exposing (Msg(SetThemeDone))
import Json.Encode as JE

import Http

set : Theme -> Cmd Msg
set theme =
  let
    body = JE.object [("theme", (JE.string theme.name))]
    options =
    { method = "PUT"
    , headers = []
    , url = "/api/users"
    , body = Http.jsonBody body
    , expect = Http.expectStringResponse (\_ -> Ok ())
    , timeout = Nothing
    , withCredentials = False
    }
  in
    Http.send SetThemeDone (Http.request options)
