import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './signaturePad.css'; // Import your CSS for styling

const SignaturePad = React.forwardRef((props, ref) => {
    return (
        <div className="signature-pad">
            <p>Patient/Guradian Sign Below</p>
            <SignatureCanvas
                ref={ref}
                penColor="black"
                canvasProps={{ className: 'sigCanvas' }}
            />
            <div className="buttons">
                <button type='button' className='butn-sec' onClick={() => ref.current.clear()}>Clear</button>
            </div>
        </div>
    );
});

export default SignaturePad;
