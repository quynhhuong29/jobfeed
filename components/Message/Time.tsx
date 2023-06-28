import React from 'react'

interface TimesProps {
    total: number
}

const Times = ({total}: TimesProps) => {
    return (
        <div>
            <span>
                {
                    (total/3600).toString().length < 2
                    ? '0' + total/3600
                    : total/3600
                }
            </span>
            <span>:</span>

            <span>
                {
                    (total/60).toString().length < 2
                    ? '0' + total/60
                    : total/60
                }
            </span>
            <span>:</span>

            <span>
                {
                    (total%60).toString().length < 2
                    ? '0' + (total%60) + 's'
                    : (total%60) + 's'
                }
            </span>
        </div>
    )
}

export default Times
