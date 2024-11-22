import React, { useEffect, useContext } from 'react';
import UserProfile from './UserProfile';
import { OLMapContext } from '../../../../../Context/OlMapContext';

function S124User() {

    const { olMap } = useContext(OLMapContext);

    useEffect(() => {
        var profileButtonList = document.getElementById('profileButtonList');
        const profileContainer = document.getElementById('profileContainer');
        if (profileButtonList && profileContainer != null) {
            profileButtonList.append(profileContainer);
        }
    }, [olMap]);

    return (
        <>
            <div id="profileContainer" style={{ position: 'relative' }}>
                <UserProfile />
            </div>
        </>
    );
}

export default S124User;