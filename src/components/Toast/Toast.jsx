import React from 'react';
import './toast.scss';

export const Toast = ({ message }) => {
    return <div className="toast">
        {message}
    </div>
}