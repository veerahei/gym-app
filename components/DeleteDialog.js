import { Portal, Dialog, Text, Button } from "react-native-paper"

export default function DeleteDialog({ visible, onDismiss, onConfirm }) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Content>
                    <Text>Are you sure you want to delete this activity?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={onConfirm}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}