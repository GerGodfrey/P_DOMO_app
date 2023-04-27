import React, { useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion';
import axios from 'axios';
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import {Navbar} from '../components';


const Doubts = () => {
    const [data, setData] = useState({});
    useEffect(() => {
        axios.get('https://notion-api.splitbee.io/v1/page/54607699593d450aa4900a9132a54412')
            .then(res => setData(res.data))
    }, []);

    return (
        <div>
            <Navbar/>
            <div className='instructions min-h-[80vh]'>
                <div className='bg-white w-full overflow-hidden'>
                    <div className= " sm:px-16 px-6 flex justify-center items-center" >
                        <div className="xl:max-w-[1280px] w-full">
                        </div>
                    </div>
                </div>
                <div className='flex pl-[10%] pr-[10%] pt-[50px]'>
                    <NotionRenderer blockMap={data} />
                </div>
            </div>
        </div>
    );
};

export default Doubts;