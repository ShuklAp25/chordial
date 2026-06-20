// app/api/recognize/route.js
// This is a template for integrating with AudD or ACRCloud

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return Response.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Example: AudD integration
    const auddFormData = new FormData();
    auddFormData.append('file', audioFile);
    auddFormData.append('api_token', process.env.AUDD_API_KEY);

    const auddResponse = await fetch('https://api.audd.io/', {
      method: 'POST',
      body: auddFormData,
    });

    const auddData = await auddResponse.json();

    if (auddData.result) {
      return Response.json({
        success: true,
        title: auddData.result.title,
        artist: auddData.result.artist,
        album: auddData.result.album,
        spotify_id: auddData.result.spotify?.id,
        confidence: auddData.result.score / 100,
      });
    } else {
      return Response.json(
        { error: 'Song not recognized' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Recognition error:', error);
    return Response.json(
      { error: 'Recognition failed' },
      { status: 500 }
    );
  }
}

/* 
  To use this in your component:
  
  const recognizeSong = async () => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch('/api/recognize', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    setRecognitionResult(data);
  };
*/
