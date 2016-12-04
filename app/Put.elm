module Put exposing (main)

import Http
import Json.Encode as JE

type Msg = SetThemeDone (Result Http.Error ())

main : String -> Cmd Msg
main hey =
  let
    body = JE.object [("theme", (JE.string hey))]
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
