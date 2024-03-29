export const newMsgSound = (senderName) => {
    const sound = new Audio('/light.mp3')
    sound && sound.play()
    if (senderName) {
        document.title = `New Message from ${senderName}`
        if (document.visibilityState === "visible") {
            document.title = "Messages"
        }
    }
}