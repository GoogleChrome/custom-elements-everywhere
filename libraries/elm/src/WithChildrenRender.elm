module WithChildrenRender exposing (main)

import Html exposing (Html)
import Html.Attributes

main : Html msg
main =
    Html.node "ce-with-children" [ Html.Attributes.id "wc" ] [ Html.text "2" ]
