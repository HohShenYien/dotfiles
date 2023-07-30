import QtQuick 2.5

Image {
    id: root
    source: "images/moon.jpg"

    property int stage

    onStageChanged: {
        if (stage == 1) {
            introAnimation.running = true
        }
    }

    Item {
        id: content
        anchors.fill: parent
        opacity: 0
        TextMetrics {
            id: units
            text: "M"
            property int gridUnit: boundingRect.height
            property int largeSpacing: units.gridUnit
            property int smallSpacing: Math.max(2, gridUnit/4)
        }
       
        Image {
            id: logo
            property real size: units.gridUnit * 12
            anchors.centerIn: parent
            source: "images/plasmalogo.png"
            sourceSize.width: 166
            sourceSize.height: 166

            ParallelAnimation {
                running: true

                ScaleAnimator {
                    target: logo
                    from: 0
                    to: 1
                    duration: 700
                }
                OpacityAnimator {
                    target: logo
                    from: 0.75
                    to: 1
                    duration: 1200
                }

                SequentialAnimation {
                    loops: Animation.Infinite

                    ScaleAnimator {
                        target: logo
                        from: 0.9
                        to: 1
                        duration: 2100
                    }
                    ScaleAnimator {
                        target: logo
                        from: 1
                        to: 0.9
                        duration: 2100
                    }
                }
            }
        }

        Image {
            id: topRect
            anchors.centerIn: parent
            source: "images/rectangle.svg"
            Rectangle {
                radius: 3
                color: "#1793D190"
                anchors {
                    bottom: parent.bottom
                    bottomMargin: 0
                    horizontalCenter: parent.horizontalCenter
                }
                height: 12
                width: height*36
                Rectangle {
                    radius: 3
                    anchors {
                        left: parent.left
                        top: parent.top
                        bottom: parent.bottom
                    }
                    width: (parent.width / 6) * (stage - 1)
                    color: "#1793D1"
                    Behavior on width {
                        PropertyAnimation {
                            duration: 250
                            easing.type: Easing.InOutQuad
                        }
                    }
                }
            }
        }
    }

    OpacityAnimator {
        id: introAnimation
        running: false
        target: content
        from: 0
        to: 1
        duration: 1000
        easing.type: Easing.InOutQuad
    }
}
