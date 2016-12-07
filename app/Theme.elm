module Theme exposing (..)

import Http
import Json.Encode as JE
import Json.Decode as JD
import Messages exposing (Msg(SetThemeDone))
import Model exposing (Theme(Moleskine, Hoth))

toString : Theme -> String
toString theme =
    case theme of
        Moleskine ->
            "moleskine"

        Hoth ->
            "hoth"


set : Theme -> Cmd Msg
set theme =
    let
        themeName =
            toString theme

        body =
            JE.object [ ( "theme", (JE.string themeName) ) ]

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

parse : String -> Theme
parse toDecode =
    let
        valueDe =
            JD.decodeString JD.string toDecode
    in
        case valueDe of
            Ok name ->
                if (String.toLower name) == "hoth" then
                    Hoth
                else
                    Moleskine

            Err msg ->
                Moleskine

themeDecoder : JD.Decoder Theme
themeDecoder =
  JD.string |> JD.map parse
