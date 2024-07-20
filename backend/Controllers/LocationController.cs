using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationRepository _locationRepository;

        public LocationController(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        // GET: api/locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            var locations = await _locationRepository.GetAllLocationsAsync();
            return Ok(locations);
        }

        // GET: api/locations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            var location = await _locationRepository.GetLocationByIdAsync(id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(location);
        }

        // POST: api/locations
        [HttpPost]
        public async Task<ActionResult<Location>> PostLocation(Location location)
        {
            var createdLocation = await _locationRepository.AddLocationAsync(location);
            return CreatedAtAction(nameof(GetLocation), new { id = createdLocation.Id }, createdLocation);
        }

        // PUT: api/locations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLocation(int id, Location location)
        {
            if (id != location.Id)
            {
                return BadRequest();
            }

            await _locationRepository.UpdateLocationAsync(location);
            return NoContent();
        }

        // DELETE: api/locations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var location = await _locationRepository.GetLocationByIdAsync(id);
            if (location == null)
            {
                return NotFound();
            }

            await _locationRepository.DeleteLocationAsync(id);
            return NoContent();
        }
    }
}
