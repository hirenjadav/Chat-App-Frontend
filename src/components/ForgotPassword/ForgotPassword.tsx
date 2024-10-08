import { useState } from 'react'
import FontIconWrapper from '../FontIconWrapper';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import httpServices from '../../services/httpServices';
import API_ENDPOINT_CONSTANTS from '../../constants/apiEndpointConstants';

export default function ForgotPassword() {

  const [emailCredential, setEmailCredential] = useState('');

  const handleEmailSubmit = () => {

    httpServices
      .post(API_ENDPOINT_CONSTANTS.LOGIN, emailCredential)
      .then(response => {
        console.log(response);
      });
  }

  return (
    <div>

      <div className="d-flex flex-column">

        <label>Email</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-envelope" className="input-field-icon"></FontIconWrapper>
          <InputText
            placeholder="abc@xyz.com"
            className="w-100"
            value={emailCredential}
            onInput={(e) => setEmailCredential((e.target as HTMLInputElement).value)}
          />
        </div>

        <Button className="mt-4" label="Send Reset Link" onClick={handleEmailSubmit} />

        <hr />

        <Link to="/auth/signin">
          <Button className="w-100" label="Signin with Email" outlined />
        </Link>

      </div>
    </div>
  )
}
