module Spinner exposing (down, up)

import Model exposing (Model)


-- import Messages exposing (Msg(..))
-- import Http
-- import Task


up : Model -> Model
up model =
    { model | requestCount = model.requestCount + 1 }


down : Model -> Model
down model =
    -- let
    --     _ =
    --         if model.requestCount == 0 then
    --             Debug.log "Down below zero" 43
    --         else
    --             0
    -- in
    { model
        | requestCount =
            if model.requestCount < 1 then
                0
            else
                model.requestCount - 1
    }



-- https://gist.github.com/folkertdev/1cfd9e9769edec030acec99f2d2c3362#file-main-elm-L108
-- send : (a -> msg) -> Http.Request a -> Cmd msg
-- send toMsg request =
--     Cmd.batch
--         [ Task.perform identity (Task.succeed IncreaseRequestCounter)
--         , Task.attempt (HttpRequestWrapper << toMsg) (Http.toTask request)
--         ]
