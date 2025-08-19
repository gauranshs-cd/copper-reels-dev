#!/usr/bin/env python3
"""
Extract Pattern Bank data from Excel and convert to JSON/Markdown
"""

import pandas as pd
import json
import sys

def extract_pattern_bank():
    file_path = '/Users/arvindsarin/Cursor/Claude/copper-reels/documents/masterclass-transcripts/YouTube Growth System 2.0/Copy of  PATTERN BANK + IDEATION 2.0.xlsx'
    
    try:
        xl_file = pd.ExcelFile(file_path)
        all_patterns = {
            'channels': {},
            'niche_patterns': {},
            'adjacent_patterns': {},
            'metadata': {
                'total_sheets': len(xl_file.sheet_names),
                'sheet_names': xl_file.sheet_names
            }
        }
        
        for sheet_name in xl_file.sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            df = df.fillna('')  # Replace NaN with empty strings
            
            if 'CHANNEL' in sheet_name.upper():
                channel_data = {
                    'outlier_titles': [],
                    'topics': [],
                    'powerwords': [],
                    'title_structures': [],
                    'thumbnail_patterns': [],
                    'formats': [],
                    'example_titles': []
                }
                
                for _, row in df.iterrows():
                    if row.get('Outlier titles'):
                        channel_data['outlier_titles'].append(str(row['Outlier titles']))
                    if row.get('Topic'):
                        channel_data['topics'].append(str(row['Topic']))
                    if row.get('Powerwords/Title Patterns'):
                        channel_data['powerwords'].append(str(row['Powerwords/Title Patterns']))
                    if row.get('Repeating Title Structures'):
                        channel_data['title_structures'].append(str(row['Repeating Title Structures']))
                    if row.get('Thumbnail patterns'):
                        channel_data['thumbnail_patterns'].append(str(row['Thumbnail patterns']))
                    if row.get('Format '):
                        channel_data['formats'].append(str(row['Format ']))
                    if row.get('Titles you could make '):
                        channel_data['example_titles'].append(str(row['Titles you could make ']))
                
                # Clean up empty values
                for key in channel_data:
                    channel_data[key] = [x for x in channel_data[key] if x]
                
                all_patterns['channels'][sheet_name] = channel_data
                
            elif 'NICHE PATTERNS' in sheet_name.upper():
                niche_data = {
                    'patterns': [],
                    'examples': []
                }
                
                for _, row in df.iterrows():
                    pattern_entry = {
                        'title': str(row.get('Outlier titles', '')),
                        'topic': str(row.get('Topic', '')),
                        'powerwords': str(row.get('Powerwords/Title Patterns', '')),
                        'structure': str(row.get('Repeating Title Structures', '')),
                        'thumbnail': str(row.get('Thumbnail patterns', '')),
                        'format': str(row.get('Format ', '')),
                        'examples': str(row.get('Titles you could make ', ''))
                    }
                    # Only add if not all empty
                    if any(v for v in pattern_entry.values() if v):
                        niche_data['patterns'].append(pattern_entry)
                
                if 'ADJACENT' in sheet_name:
                    all_patterns['adjacent_patterns'][sheet_name] = niche_data
                else:
                    all_patterns['niche_patterns'][sheet_name] = niche_data
        
        return all_patterns
        
    except Exception as e:
        print(f"Error extracting pattern bank: {e}", file=sys.stderr)
        return None

def create_markdown_report(patterns):
    """Create a markdown report from the extracted patterns"""
    
    md_content = """# Pattern Bank & Ideation Data

## Overview
This document contains extracted patterns from successful YouTube channels for content ideation.

## Channel Analysis

"""
    
    # Add channel patterns
    for channel_name, channel_data in patterns['channels'].items():
        md_content += f"### {channel_name}\n\n"
        
        if channel_data['outlier_titles']:
            md_content += "**Outlier Titles:**\n"
            for title in channel_data['outlier_titles'][:5]:
                md_content += f"- {title}\n"
            md_content += "\n"
        
        if channel_data['powerwords']:
            md_content += "**Power Words:**\n"
            for word in channel_data['powerwords'][:10]:
                md_content += f"- {word}\n"
            md_content += "\n"
        
        if channel_data['title_structures']:
            md_content += "**Title Structures:**\n"
            for structure in channel_data['title_structures'][:5]:
                md_content += f"- {structure}\n"
            md_content += "\n"
        
        if channel_data['thumbnail_patterns']:
            md_content += "**Thumbnail Patterns:**\n"
            for pattern in channel_data['thumbnail_patterns'][:5]:
                md_content += f"- {pattern}\n"
            md_content += "\n"
        
        if channel_data['example_titles']:
            md_content += "**Example Titles You Could Make:**\n"
            for title in channel_data['example_titles'][:5]:
                md_content += f"- {title}\n"
            md_content += "\n---\n\n"
    
    # Add niche patterns
    if patterns['niche_patterns']:
        md_content += "## Niche Patterns\n\n"
        for niche_name, niche_data in patterns['niche_patterns'].items():
            md_content += f"### {niche_name}\n\n"
            for i, pattern in enumerate(niche_data['patterns'][:5], 1):
                if pattern['title']:
                    md_content += f"**Pattern {i}:**\n"
                    md_content += f"- Title: {pattern['title']}\n"
                    if pattern['powerwords']:
                        md_content += f"- Power Words: {pattern['powerwords']}\n"
                    if pattern['structure']:
                        md_content += f"- Structure: {pattern['structure']}\n"
                    if pattern['examples']:
                        md_content += f"- Example: {pattern['examples']}\n"
                    md_content += "\n"
    
    return md_content

if __name__ == "__main__":
    print("Extracting Pattern Bank data...")
    patterns = extract_pattern_bank()
    
    if patterns:
        # Save as JSON
        json_path = '/Users/arvindsarin/Cursor/Claude/AI-Powered YouTube Content Creation System /copper-flow-studio/src/data/pattern_bank.json'
        with open(json_path, 'w') as f:
            json.dump(patterns, f, indent=2)
        print(f"✅ Saved JSON to: {json_path}")
        
        # Create markdown report
        md_content = create_markdown_report(patterns)
        md_path = '/Users/arvindsarin/Cursor/Claude/AI-Powered YouTube Content Creation System /copper-flow-studio/src/data/PATTERN_BANK.md'
        with open(md_path, 'w') as f:
            f.write(md_content)
        print(f"✅ Saved Markdown to: {md_path}")
        
        # Print summary
        print("\n📊 Summary:")
        print(f"- Total Channels: {len(patterns['channels'])}")
        print(f"- Niche Patterns: {len(patterns['niche_patterns'])}")
        print(f"- Adjacent Patterns: {len(patterns['adjacent_patterns'])}")
        
        total_patterns = 0
        for channel in patterns['channels'].values():
            total_patterns += len(channel.get('outlier_titles', []))
        print(f"- Total Outlier Titles: {total_patterns}")
    else:
        print("❌ Failed to extract patterns")