import React from 'react';
import {Card, CardDeck} from 'react-bootstrap';

import './PageFooter.css';

export function PageFooter() {
    return (
        <footer>
            <CardDeck className='myCardDeck'>
                <Card className='myCard'>
                    <Card.Body>
                        <div className='d-block text-muted'>© Lukasz Gajewski 2022</div>
                    </Card.Body>
                </Card>
            </CardDeck>
        </footer>
    );
}