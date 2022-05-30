import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Users } from './Users/Users';

type Entity = 'Users';

export function AdminPage() {
    const [activeEntityLabel, setActiveEntityLabel] = useState<Entity | undefined>(undefined);
    const entities: { label: Entity, component: React.FC }[] = [
        { label: 'Users', component: Users },
    ];

    return (
        <main className='justify-content-center'>
            <div className='overflow-hidden p-3 m-md-3 text-center bg-dark'>
                <div className='mx-auto my-5'>
                    {entities.map(entity => {
                        const className = ['mr-5', entity.label === activeEntityLabel ? 'active' : ''].join(' ');
                        return <Button
                            key={entity.label}
                            onClick={() => setActiveEntityLabel(entity.label)}
                            className={className}
                        >
                            {entity.label}
                        </Button>;
                    })}
                </div>
            </div>
            <div className='d-md-flex justify-content-center w-100 my-md-3 pl-md-3'>
                {
                    entities.map(entity => {
                        if (entity.label === activeEntityLabel) {
                            return <entity.component key={entity.label} />;
                        }
                        return '';
                    })
                }
            </div>
        </main>
    );
}