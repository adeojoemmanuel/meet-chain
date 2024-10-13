"use strict";

import { strict } from 'assert';
import { server } from './server';

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
