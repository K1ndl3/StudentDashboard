import "../canvas-modal/CanvasModal.css"

function CanvasModal({isOpen, onClose}) {

    if (!isOpen) return null

    return (
        <div className="canvas-modal-container">
            <span
                className="input-container"
            >
                <input 
                    className="input-link"
                    type="text" 
                    placeholder="Enter Calendar Link"/>

            </span>

            <span className="input-container-button">
                <button
                    className="input-send"
                    onClick={() => {
                        onClose()
                        // add logic here to send the calendar link
                        // add it with jwt as wll
                    }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    Enter
                </button>
                <button
                    className="input-close"
                    onClick={() => onClose()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Close</button>
            </span>

        </div>

    )
}

export default CanvasModal