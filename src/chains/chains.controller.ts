import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChainsService, ChainInfo } from './chains.service';

@ApiTags('chains')
@Controller('v1/chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {}

  @Get()
  @ApiOperation({ summary: 'Get supported chains with optional filtering and pagination' })
  @ApiQuery({ name: 'keyword', required: false, description: 'Search term for fuzzy search' })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset' })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the list of supported chains',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              key: { type: 'string' }
            }
          }
        },
        total: { type: 'number' }
      }
    }
  })
  getChains(
    @Query('keyword') keyword?: string,
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
  ) {
    const offsetNum = parseInt(offset);
    const limitNum = parseInt(limit);

    // First apply fuzzy search
    const filteredChains = this.chainsService.findChains(keyword);
    
    // Then apply pagination
    const paginatedChains = this.chainsService.getPaginatedChains(
      filteredChains,
      offsetNum,
      limitNum,
    );

    return {
      items: paginatedChains,
      total: filteredChains.length,
    };
  }
} 