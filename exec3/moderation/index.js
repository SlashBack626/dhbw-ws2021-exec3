const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('bla bla') ? 'rejected' : 'approved';
    console.log("CommentCreated received, status set to = ", status);
    console.log(data);
    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }
  
  console.log("comment moderated and published ", data);
  
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
