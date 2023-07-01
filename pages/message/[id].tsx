import React from 'react'
import LeftSide from '../../components/Message/LeftSide'
import RightSide from '../../components/Message/RightSide'
import { LayoutMain } from '@/components/layout'

const Conversation = () => {
    return (
        <LayoutMain>
            <div className="message d-flex">
                <div className="col-md-4 border-right px-0 left_mess">
                    <LeftSide />
                </div>

                <div className="col-md-8 px-0">
                    <RightSide />
                </div>
            </div>
        </LayoutMain>
        
    )
}

export default Conversation
