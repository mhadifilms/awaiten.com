const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// CSV parsing logic (simple since we know the format is quoted strings)
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].match(/"[^"]*"|[^,]+/g).map(h => h.replace(/^"|"$/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle multiline quoted values if necessary (simple split might fail on commas inside quotes)
    // A more robust regex for CSV line parsing:
    const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    // Actually, since the file is provided as full content, I can use a better regex or just standard splitting if I'm careful.
    // Given the complexity of HTML content in CSV, simple splitting is dangerous.
    // Let's use a proper CSV parser regex approach.
    
    // Regex to match CSV fields: quoted or unquoted
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    let match;
    const row = [];
    let line = lines[i];
    
    // Dealing with multiline content in CSV is tricky with just split('\n').
    // The provided file content seems to have one record per line, but "Content" might contain newlines.
    // However, the `read_file` output shows line numbers, suggesting the CSV structure is maintained.
    // The regex approach on the WHOLE file content is safer.
  }
  return [];
}

// Actually, let's just read the file content directly since I have it from the previous turn.
// I will use the `csv-parse` library if available, or write a robust parser.
// Since I cannot install packages easily, I will write a robust parser.

const csvContent = fs.readFileSync('/Users/livestream/Downloads/Individual Projects.csv', 'utf8');

function parseCSVFull(text) {
  const result = [];
  let row = [];
  let inQuote = false;
  let currentToken = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentToken += '"';
        i++; // skip next quote
      } else if (char === '"') {
        inQuote = false;
      } else {
        currentToken += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        row.push(currentToken);
        currentToken = '';
      } else if (char === '\r' || char === '\n') {
        if (currentToken || row.length > 0) {
            row.push(currentToken);
            result.push(row);
        }
        row = [];
        currentToken = '';
        // Handle \r\n or just \n or \r
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentToken += char;
      }
    }
  }
  if (currentToken || row.length > 0) {
      row.push(currentToken);
      result.push(row);
  }
  return result;
}

const rows = parseCSVFull(csvContent);
const headers = rows[0];
const projects = rows.slice(1).map(row => {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj;
});

const imageDir = path.resolve('public/images/cms');
if (!fs.existsSync(imageDir)){
    fs.mkdirSync(imageDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file async. (But we don't check the result)
      reject(err.message);
    });
  });
}

// Helper to extract image URLs from HTML content
function extractImagesFromHtml(html) {
  const regex = /src="(https:\/\/framerusercontent\.com\/images\/[^"]+)"/g;
  const images = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    images.push(match[1]);
  }
  return images;
}

async function processProjects() {
  const processedProjects = [];

  for (const project of projects) {
    // 1. Thumbnail
    let thumbUrl = project['Thumbnail'];
    let thumbLocalPath = '';
    if (thumbUrl && thumbUrl.includes('framerusercontent.com')) {
        const filename = path.basename(new URL(thumbUrl).pathname);
        thumbLocalPath = `/images/cms/${filename}`;
        const localFilePath = path.join(imageDir, filename);
        if (!fs.existsSync(localFilePath)) {
            console.log(`Downloading thumbnail: ${thumbUrl}`);
            try {
                await downloadImage(thumbUrl, localFilePath);
            } catch (e) {
                console.error(`Failed to download ${thumbUrl}: ${e}`);
            }
        }
    } else {
        thumbLocalPath = thumbUrl;
    }

    // 2. Process HTML content fields for images
    const htmlFields = ['About', 'Content', 'Other Info 1', 'Other Info 2'];
    const processedFields = {};

    for (const field of htmlFields) {
        let content = project[field] || '';
        const images = extractImagesFromHtml(content);
        
        for (const imgUrl of images) {
            const filename = path.basename(new URL(imgUrl).pathname);
            const localPath = `/images/cms/${filename}`;
            const localFilePath = path.join(imageDir, filename);
            
            if (!fs.existsSync(localFilePath)) {
                 console.log(`Downloading content image: ${imgUrl}`);
                 try {
                     await downloadImage(imgUrl, localFilePath);
                 } catch (e) {
                     console.error(`Failed to download ${imgUrl}: ${e}`);
                 }
            }
            
            // Replace URL in content
            content = content.replace(imgUrl, localPath);
        }
        processedFields[field] = content;
    }

    processedProjects.push({
      id: project['Slug'],
      slug: project['Slug'],
      category: project['Category'],
      title: project['Title'],
      thumbnail: thumbLocalPath,
      thumbnailAlt: project['Thumbnail:alt'],
      duration: project['Duration'],
      client: project['Client'],
      deliverables: project['Deliverables'],
      about: processedFields['About'],
      videoEmbed: project['Video Embed'],
      galleryEmbed: project['Gallery Embed'],
      content: processedFields['Content'],
      otherInfo1: processedFields['Other Info 1'],
      otherInfo2: processedFields['Other Info 2']
    });
  }

  const finalJson = { projects: processedProjects };
  fs.writeFileSync('src/data/projects.json', JSON.stringify(finalJson, null, 2));
  console.log('Projects JSON updated successfully.');
}

processProjects();

