import React from 'react'

interface TimesProps {
    total: number
}

const Times = ({total}: TimesProps) => {
    return (
        <div>
            <span>
                {
                    (parseInt((total/3600) as unknown as string)).toString().length < 2
                    ? '0' + parseInt((total/3600) as unknown as string)
                    : parseInt((total/3600) as unknown as string)
                }
            </span>
            <span>:</span>

            <span>
                {
                    parseInt((total/60) as unknown as string).toString().length < 2
                    ? '0' + parseInt((total/60) as unknown as string)
                    : parseInt((total/60) as unknown as string)
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
